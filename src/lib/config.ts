import * as path from 'path';

export const PORT = process.env.port ? parseInt(process.env.port, 10) : 3000;
export const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve('./data');
export const SCREENSHOTS_DIR = path.join(DATA_DIR, 'screenshots');
export const PRODUCTION = process.env.NODE_ENV === 'production';
export const DISABLE_CHROMIUM_SANDBOX = process.env.DISABLE_CHROMIUM_SANDBOX === 'true';
export const CHROMIUM_PATH = process.env.CHROMIUM_PATH ? process.env.CHROMIUM_PATH : null;
