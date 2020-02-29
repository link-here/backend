import {Path, Security, GET, POST, QueryParam} from 'typescript-rest';
import {save, capture} from '../lib/link';
import {Link} from '../lib/db';
import {APIResult, AddLinksResponse, GetLinksResponse} from '../interfaces';

@Path('/api/v1/links')
@Security('ROLE_USER')
export default class {
  @POST
  async addLinks(req: {urls: string[]}): Promise<APIResult<AddLinksResponse>> {
    // Add links to database
    const res = await Promise.all(req.urls.map(async url => save(url)));

    // Start capturing screenshots...
    Promise.all(res.map(async l => capture(l)));

    // But return first so user doesn't have to wait
    return {success: true, result: {links: res}, error: null};
  }

  @GET
  async getLinks(@QueryParam("limit") limit = 10, @QueryParam('skip') skip = 0): Promise<APIResult<GetLinksResponse>> {
    // Get total # of links
    const n = await Link.count();

    // Get all links
    const links = await Link.findAll({limit, offset: skip, order: [['createdAt', 'DESC']]});

    const hasMore = skip + limit < n;

    return {success: true, result: {links, hasMore}, error: null};
  }
}
