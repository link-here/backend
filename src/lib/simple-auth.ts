import {ServiceAuthenticator} from 'typescript-rest';
import * as express from 'express';
import {AuthToken} from './db';

const authMiddleware = async (req: express.Request, res: express.Response, next: () => void): Promise<void> => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1];

    if (await AuthToken.findOne({where: {token}})) {
      return next();
    }
  }

  res.status(403).json({success: false, error: 'Unauthorized'});
};

export default class implements ServiceAuthenticator {
  private readonly middleware: express.Handler;

  constructor() {
    this.middleware = authMiddleware;
  }

  initialize(router: express.Router): void {
    router.use(this.middleware);
  }

  getMiddleware(): express.RequestHandler {
    return this.middleware;
  }

  getRoles(): string[] {
    return ['ROLE_USER'];
  }
}
