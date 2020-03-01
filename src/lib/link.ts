import * as path from 'path';
import * as captureWebsite from 'capture-website';
import {decode} from 'url-encode-decode';
import {SCREENSHOTS_DIR} from './config';
import {Link} from './db';

export const save = async (url: string): Promise<Link> => {
  let u = decode(url);

  // Extract URL from string, might have other garbage depending on source
  // https://stackoverflow.com/a/31760088/12638523
  u = u.match(/(https?:\/\/[^ ]*)/)[1];

  return Link.create({url: u});
};

export const capture = async (l: Link): Promise<void> => {
  return captureWebsite.file(l.url, path.join(SCREENSHOTS_DIR, `${l.id}.png`), {
    scaleFactor: 1,
    beforeScreenshot: async page => {
      const title = await page.title();

      l.title = title;

      await l.save();
    }
  });
};
