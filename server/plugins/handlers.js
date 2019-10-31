import { handlers } from 'auth0-extension-hapi-tools';
import config from '../lib/config';

import configNext from '../lib/configNext';
var ManagementClient = require('auth0').ManagementClient;
import logger from '../lib/logger';

const tools = require('auth0-extension-tools');
const Boom = require('boom');

const validateHookToken = (domain, webtaskUrl, extensionSecret) => {
  if (domain === null || domain === undefined) {
    throw new tools.ArgumentError('Must provide the domain');
  }

  if (typeof domain !== 'string' || domain.length === 0) {
    throw new tools.ArgumentError(`The provided domain is invalid: ${domain}`);
  }

  if (webtaskUrl === null || webtaskUrl === undefined) {
    throw new tools.ArgumentError('Must provide the webtaskUrl');
  }

  if (typeof webtaskUrl !== 'string' || webtaskUrl.length === 0) {
    throw new tools.ArgumentError(`The provided webtaskUrl is invalid: ${webtaskUrl}`);
  }

  if (extensionSecret === null || extensionSecret === undefined) {
    throw new tools.ArgumentError('Must provide the extensionSecret');
  }

  if (typeof extensionSecret !== 'string' || extensionSecret.length === 0) {
    throw new tools.ArgumentError(`The provided extensionSecret is invalid: ${extensionSecret}`);
  }

  return hookPath => {
    if (hookPath === null || hookPath === undefined) {
      throw new tools.ArgumentError('Must provide the hookPath');
    }

    if (typeof hookPath !== 'string' || hookPath.length === 0) {
      throw new tools.ArgumentError(`The provided hookPath is invalid: ${hookPath}`);
    }

    return {
      method(req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          const token = req.headers.authorization.split(' ')[1];

          try {
            logger.info(`Validating hook token with signature: ${extensionSecret.substr(0, 4)}...`);
            if (tools.validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, token)) {
              return res();
            }
          } catch (e) {
            logger.error('Invalid token:', token);
            return res(Boom.wrap(e, 401, e.message));
          }
        }

        const err = new tools.HookTokenError(`Hook token missing for the call to: ${hookPath}`);
        return res(Boom.unauthorized(err, 401, err.message));
      }
    };
  };
};

module.exports.register = (server, options, next) => {
  server.decorate('server', 'handlersAuth', {
    managementClient: {
      method: (req, callback) => {
        let auth0 = new ManagementClient({
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGE3MjdlMjkxM2M4ZDEwM2RlNDk2YjEiLCJ1c2VyX2lkIjoiYXV0aDB8NWM0MGFmZTc1NTgyOTM3ZTllNTI1OGFjIiwibmFtZSI6ImFuYWxpc3RhLmNoYXBlY29AYXByb3ZhZGlnaXRhbC5uZXQiLCJuaWNrbmFtZSI6ImFuYWxpc3RhLmNoYXBlY28iLCJpZGVudGl0aWVzIjpbeyJwcm9maWxlRGF0YSI6eyJlbWFpbCI6ImFuYWxpc3RhLmNoYXBlY29AYXByb3ZhZGlnaXRhbC5uZXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInVzZXJfaWQiOiI1YzQwYWZlNzU1ODI5MzdlOWU1MjU4YWMiLCJwcm92aWRlciI6ImF1dGgwIiwiY29ubmVjdGlvbiI6IlVzZXJuYW1lLVBhc3N3b3JkLUF1dGhlbnRpY2F0aW9uIiwiaXNTb2NpYWwiOmZhbHNlfV0sInBhc3N3b3JkIjoiJDJiJDEyJEhaOTlsYjUuMm92QWd3US91RzNWaWVReTVuQjlTRmQuMEZLdzl1Z3lPVm5QMUpLTlRJWmxpIiwiZW1haWwiOiJhbmFsaXN0YS5jaGFwZWNvQGFwcm92YWRpZ2l0YWwubmV0IiwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5hbGlzdGEiLCJjcGYiOiIwODI5MTc2MzkwOSIsInRlbGVmb25lIjoiNDk5ODgxMDc4MzkiLCJlc3RhZG8iOiJTQyIsImNpZGFkZSI6IkNoYXBlY8OzIiwiY2VwIjoiODk4MTU0MjAiLCJiYWlycm8iOiJTYW50byBBbnTDtG5pbyIsInJ1YSI6IlJ1YSBNYXJhbmjDo28iLCJudW1lcm8iOiIyODdEIiwiY29tcGxlbWVudG8iOiIiLCJjaXR5Q29udHJvbCI6eyJjaXR5IjoiY2hhcGVjbyIsInN0YXRlIjoic2MifSwiY2l0eV9pZCI6MjUsImNhcmdvIjoiQU5BTElTVEEgdGVzdGUiLCJjbmFlIjpbIjIxIl19LCJpYXQiOjE1NzI1MjYxODUsImV4cCI6MTU3MjUyNjI0NX0.c4KYxIWWH4HjfveaTFR3xh_shKvcHAQDcs_MqBAUIF8',
          domain: configNext
            .get('URL_AUTH')
            .replace('http://', '')
            .replace('https://', ''),
          audience: configNext.get('URL_AUTH') + '/api/v2'
        });
        callback(auth0);
        return;
      },
      assign: 'auth0'
    }
  });
  next();
};

module.exports.register.attributes = {
  name: 'handlersAuth'
};
