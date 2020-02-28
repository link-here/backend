import * as express from 'express';
import * as makeDir from 'make-dir';
import {Server, Path, GET, POST} from 'typescript-rest';
import {DATA_DIR, SCREENSHOTS_DIR, PORT} from './lib/config';
import {sequelize, Link} from './lib/db';
import {save, capture} from './lib/link';

interface APIResult {
  success: boolean;
  result?: object;
}

interface AddLinksRequest {
  urls: string[];
}

@Path('/links')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class LinkService {
  @POST
  async addLinks(req: AddLinksRequest): Promise<APIResult> {
    // Add links to database
    const res = await Promise.all(req.urls.map(async url => save(url)));

    // Start capturing screenshots
    Promise.all(res.map(async l => capture(l)));

    // But return first so user doesn't have to wait
    return {success: true, result: res};
  }

  @GET
  async getLinks(): Promise<APIResult> {
    // Get all links
    const links = await Link.findAll({order: [['createdAt', 'DESC']]});

    return {success: true, result: links};
  }
}

// Init app
const app: express.Application = express();
Server.buildServices(app);

app.listen(PORT, async () => {
  // Create data directories if necessary
  await makeDir(DATA_DIR);
  await makeDir(SCREENSHOTS_DIR);

  // Create database if necessary
  await sequelize.sync({alter: true});

  console.log(`Ready on port ${PORT}!`);
});
