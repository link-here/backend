import {Path, Security, GET, PathParam, Return, ContextResponse} from 'typescript-rest';
import express from 'express';
import path from 'path';
import {readFile} from 'fs';
import {SCREENSHOTS_DIR} from '../lib/config';

const MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 year

@Path('/api/v1/screenshots/:id')
@Security('ROLE_USER')
export default class {
  @GET
  async getScreenshot(@ContextResponse res: express.Response, @PathParam('id') id: number): Promise<Return.DownloadBinaryData> {
    const p = path.join(SCREENSHOTS_DIR, `${id}.png`);

    // Set cache header
    res.setHeader('cache-control', `public,max-age=${MAX_AGE},immutable`);

    return new Promise<Return.DownloadBinaryData>((resolve, reject) => {
      readFile(p, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(new Return.DownloadBinaryData(data, 'image/png'));
      });
    });
  }
}
