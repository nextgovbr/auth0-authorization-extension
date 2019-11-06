import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { urlHelpers } from 'auth0-extension-hapi-tools';

import config from '../lib/config';
import template from '../views/index';

import configNext from '../lib/configNext';

const assembleHtmlRoute = link => ({
  method: 'GET',
  path: link,
  config: {
    description: 'Render HTML',
    auth: false
  },
  handler: (req, reply) => {
    const cfg = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('AUTH0_CLIENT_ID'),
      BASE_URL: configNext.get('URL'),
      API_BASE: configNext.get('URL'),
      BASE_PATH: configNext.get('URL'),
      SEARCH_ENGINE: config('AUTH0_RTA').replace('https://', '') !== 'auth0.auth0.com' ? 'v2' : 'v3'
    };

    // Development.
    if (process.env.NODE_ENV === 'development') {
      return reply(
        ejs.render(template, {
          config: {
            ...cfg,
            API_BASE: configNext.get('URL')
          },
          assets: {
            app: configNext.get('URL') + '/app/bundle.js'
          }
        })
      );
    }

    // Render from CDN.
    const clientVersion = config('CLIENT_VERSION');
    if (clientVersion) {
      return reply(
        ejs.render(template, {
          config: cfg,
          assets: { version: clientVersion }
        })
      );
    }

    // Render locally.
    return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, data) => {
      const locals = {
        config: cfg,
        assets: {
          app: '/app/bundle.js'
        }
      };

      if (!err && data) {
        locals.assets = JSON.parse(data);

        if (locals.assets.app) {
          locals.assets.app = `/app/${locals.assets.app}`;
        }

        if (locals.assets.vendors) {
          locals.assets.vendors = `/app/${locals.assets.vendors}`;
        }

        if (locals.assets.style) {
          locals.assets.style = `/app/${locals.assets.style}`;
        }
      }

      // Render the HTML page.
      reply(ejs.render(template, locals));
    });
  }
});

const clientRoutes = [
  '/',
  '/api',
  '/entrar',
  '/configuration',
  '/configuration/rule',
  '/configuration/api',
  '/roles',
  '/roles/{id}',
  '/groups',
  '/groups/{id}',
  '/permissions',
  '/permissions/{id}',
  '/users',
  '/users/{id}',
  '/import-export'
];

module.exports.register = (server, options, next) => {
  clientRoutes.map(link => server.route(assembleHtmlRoute(link)));

  next();
};

module.exports.register.attributes = {
  name: 'html'
};
