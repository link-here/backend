import * as path from 'path';

export const PORT = process.env.port ? parseInt(process.env.port, 10) : 3000;
export const DATA_DIR = process.env.DATA_DIR ? process.env.DATA_DIR : './data';
export const SCREENSHOTS_DIR = path.join(DATA_DIR, 'screenshots');
