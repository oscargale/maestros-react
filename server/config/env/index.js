import path from 'path';
import envConfig from './development';
const env = process.env.NODE_ENV || 'development';
//const envConfig = require(`./${env}`);

const config = {
  ...envConfig,
};

const defaults = {
  root: path.join(__dirname, '/..'),
};

export default Object.assign(defaults, config);
