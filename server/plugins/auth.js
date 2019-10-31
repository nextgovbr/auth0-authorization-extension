import Boom from 'boom';
import crypto from 'crypto';
import jwksRsa from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import * as tools from 'auth0-extension-hapi-tools';

import config from '../lib/config';
import { scopes } from '../lib/apiaccess';
import configNext from '../lib/configNext';

const hashApiKey = key =>
  crypto
    .createHmac('sha256', `${key} + ${config('AUTH0_CLIENT_SECRET')}`)
    .update(config('EXTENSION_SECRET'))
    .digest('hex');

module.exports.register = (server, options, next) => {
  server.auth.scheme('extension-secret', () => ({
    authenticate: (request, reply) => {
      const apiKey = request.headers['x-api-key'];
      return request.storage.getApiKey().then(key => {
        if (apiKey && apiKey === hashApiKey(key)) {
          return reply.continue({
            credentials: {
              user: 'rule'
            }
          });
        }

        return reply(Boom.unauthorized('Invalid API Key'));
      });
    }
  }));
  server.auth.strategy('extension-secret', 'extension-secret');

  const jwtOptions = {
    dashboardAdmin: {
      key: config('EXTENSION_SECRET'),
      verifyOptions: {
        audience: 'urn:api-authz',
        issuer: config('PUBLIC_WT_URL'),
        algorithms: ['HS256']
      }
    },
    resourceServer: {
      key: jwksRsa.hapiJwt2Key({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 2,
        jwksUri: `https://${config('AUTH0_DOMAIN')}/.well-known/jwks.json`
      }),
      verifyOptions: {
        audience: 'urn:auth0-authz-api',
        issuer: `https://${config('AUTH0_DOMAIN')}/`,
        algorithms: ['RS256']
      }
    }
  };

  server.auth.strategy('jwt', 'jwt', {
    // Get the complete decoded token, because we need info from the header (the kid)
    complete: true,

    verifyFunc: (decoded, req, callback) => {
      if (!decoded) {
        return callback(null, false);
      }

      const header = req.headers.authorization;
      if (header && header.indexOf('Bearer ') === 0) {
        const token = header.split(' ')[1];
        decoded.payload.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign

        return callback(null, true, decoded.payload);
      }

      return callback(null, false);
    }
  });
  server.auth.default('jwt');
  const session = {
    register: tools.plugins.dashboardAdminSession,
    options: {
      stateKey: 'authz-state',
      nonceKey: 'authz-nonce',
      sessionStorageKey: 'authz:apiToken',
      rta: 'auth0.auth0.com',
      domain: configNext.get('URL_AUTH'),
      scopes:
        'read:resource_servers create:resource_servers update:resource_servers delete:resource_servers read:clients read:connections read:rules create:rules update:rules update:rules_configs read:users',
      baseUrl: configNext.get('URL'),
      audience: 'urn:api-authz',
      secret: 'a-random-secret',
      clientName: 'Authorization Extension',
      onLoginSuccess: (decoded, req, callback) => {
        if (decoded) {
          decoded.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign
          return callback(null, true, decoded);
        }

        return callback(null, false);
      }
    }
  };
  server.register(session, err => {
    if (err) {
      next(err);
    }

    next();
  });
};

module.exports.register.attributes = {
  name: 'auth'
};
