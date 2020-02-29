import {Link} from './lib/db';

export interface APIResult<Response> {
  success: boolean;
  result: Response;
  error: string | null;
}

export interface AddLinksResponse {
  links: Link[];
}

export interface GetLinksResponse {
  links: Link[];
  hasMore: boolean;
}

export {Link};
