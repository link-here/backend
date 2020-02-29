import * as path from 'path';
import * as captureWebsite from 'capture-website';
import {SCREENSHOTS_DIR} from './config';
import {Link} from './db';

export const save = async (url: string): Promise<Link> => {
  return Link.create({url});
};

export const capture = async (l: Link): Promise<void> => {
  return captureWebsite.file(l.url, path.join(SCREENSHOTS_DIR, `${l.id}.png`), {
    scaleFactor: 1
  });
};
