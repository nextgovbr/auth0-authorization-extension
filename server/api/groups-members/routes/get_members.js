import Joi from 'joi';
import axios from 'axios';
import configNext from '../../../lib/configNext';

module.exports = server => ({
  method: 'GET',
  path: '/api/groups/{id}/members',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['read:groups']
    },
    description: 'Get the members for a group.',
    tags: ['api'],
    pre: [],
    validate: {
      params: {
        id: Joi.string()
          .guid()
          .required()
      },
      query: {
        per_page: Joi.number()
          .integer()
          .min(1)
          .max(25)
          .default(25), // eslint-disable-line newline-per-chained-call
        page: Joi.number()
          .integer()
          .min(0)
          .default(0)
      }
    }
  },
  handler: (req, reply) =>
    req.storage
      .getGroup(req.params.id)
      .then(group => {
        return axios.get(configNext.get('URL_AUTH') + '/api/v2/users/lucene', {
          params: {
            ids: (group.members || []).join(','),
            sort: 'last_login:-1',
            per_page: req.query.per_page || 100,
            page: req.query.page || 0
          }
        });
      })
      .then(users => {
        console.log('users', users);
        reply({ users: users.data.users, total: users.data.total });
      })
      .catch(err => reply.error(err))
});
