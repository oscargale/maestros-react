import '@babel/polyfill';
import config from './config/env';
import app from './config/express';

const debug = require('debug')('school-api:index');
// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
    console.log(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}
