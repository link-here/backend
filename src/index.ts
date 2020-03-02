import express from 'express';
import cors from 'cors';
import makeDir from 'make-dir';
import {Server} from 'typescript-rest';
import {DATA_DIR, SCREENSHOTS_DIR, PORT} from './lib/config';
import SimpleAuth from './lib/simple-auth';
import random from './lib/random';
import {sequelize, AuthToken} from './lib/db';

// Init app
const app: express.Application = express();

// Set up CORS
app.use(cors());
app.options('*', cors());

// Add auth strategy
Server.registerAuthenticator(new SimpleAuth());

// Load services
// Have to get .js so we don't try to import d.ts
Server.loadServices(app, 'controllers/*.js', __dirname);

// Add screenshots directory to server
app.use('/api/v1/screenshots', express.static(SCREENSHOTS_DIR));

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
