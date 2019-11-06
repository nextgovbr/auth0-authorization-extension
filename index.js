const path = require('path');
const nconf = require('nconf');
const url = require('url');

const logger = require('./server/lib/logger');

const configNext = require('./server/lib/configNext');

// Initialize babel.
require('babel-core/register')({
  ignore: /node_modules/,
  sourceMaps: !(process.env.NODE_ENV === 'production')
});
require('babel-polyfill');

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    AUTH0_RTA: configNext
      .get('URL_AUTH')
      .replace('http://', '')
      .replace('https://', ''),
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: configNext.get('PORT'),
    USE_OAUTH2: false,
    LOG_COLOR: true
  });

// Start the server.
return require('./server/init')(key => nconf.get(key), null, (err, hapi) => {
  if (err) {
    return logger.error(err);
  }

  return hapi.start(() => {
    logger.info('Server running at:', hapi.info.uri);
  });
});
