import * as express from 'express';
import * as makeDir from 'make-dir';
import {Server, Path, Security, GET, POST, QueryParam} from 'typescript-rest';
import {DATA_DIR, SCREENSHOTS_DIR, PORT} from './lib/config';
import SimpleAuth from './lib/simple-auth';
import random from './lib/random';
import {sequelize, Link, AuthToken} from './lib/db';
import {save, capture} from './lib/link';

interface APIResult {
  success: boolean;
  result?: object;
}

@Path('/api/links')
@Security('ROLE_USER')
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
class LinkService {
  @POST
  async addLinks(req: {urls: string[]}): Promise<APIResult> {
    // Add links to database
    const res = await Promise.all(req.urls.map(async url => save(url)));

    // Start capturing screenshots
    Promise.all(res.map(async l => capture(l)));

    // But return first so user doesn't have to wait
    return {success: true, result: res};
  }

  @GET
  async getLinks(@QueryParam("limit") limit = 10, @QueryParam('skip') skip = 0): Promise<APIResult> {
    // Get total # of links
    const n = await Link.count();

    // Get all links
    const links = await Link.findAll({limit, offset: skip, order: [['createdAt', 'DESC']]});

    const hasMore = skip + limit < n;

    return {success: true, result: {links, hasMore}};
  }
}

// Init app
const app: express.Application = express();

// Add auth strategy
Server.registerAuthenticator(new SimpleAuth());

Server.buildServices(app);

// Add screenshots directory to server
app.use('/api/screenshots', express.static(SCREENSHOTS_DIR));

app.listen(PORT, async () => {
  // Create data directories if necessary
  await makeDir(DATA_DIR);
  await makeDir(SCREENSHOTS_DIR);

  // Create database if necessary
  await sequelize.sync({alter: true});

  // If no tokens exist
  if (await AuthToken.count() === 0) {
    // Create a random token
    const token = random();

    await AuthToken.create({token});

    console.log(`Auth token is ${token}`);
  } else {
    // Log a valid token
    const t = await AuthToken.findOne();

    if (t) {
      console.log(`Auth token is ${t.token}`);
    }
  }

  console.log(`Ready on port ${PORT}!`);
});
