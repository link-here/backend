import {Path, Security, GET, POST, PUT, QueryParam, PathParam} from 'typescript-rest';
import {save, capture} from '../lib/link';
import {Link} from '../lib/db';
import {APIResult, AddLinksResponse, GetLinksResponse} from '../types';

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
  async getLinks(@QueryParam("limit") limit: number = 10, @QueryParam('skip') skip: number = 0, @QueryParam('hidden') hidden: boolean = false): Promise<APIResult<GetLinksResponse>> {
    // Get total # of links
    const n = await Link.count();

    // Get all links
    let where = {hidden: false};

    if (hidden) {
      delete where.hidden;
    }

    const links = await Link.findAll({limit, offset: skip, order: [['createdAt', 'DESC']], where});

    const hasMore = skip + limit < n;

    return {success: true, result: {links, hasMore}, error: null};
  }

  @PUT
  @Path('/:id')
  async updateLink(@PathParam('id') id: number, req: Link): Promise<APIResult<Link|null>> {
    // Get link
    const link = await Link.findByPk(id);

    if (!link) {
      return {success: false, error: `id ${id} does not exist`, result: null};
    }

    Object.assign(link, req);

    await link.save();

    return {success: true, error: null, result: link};
  }
}
