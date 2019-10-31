import Joi from 'joi';
import axios from 'axios';
import configNext from '../../../lib/configNext';

module.exports = server => ({
  method: 'GET',
  path: '/api/users/{id}',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['read:users']
    },
    description: 'Get a single user based on its unique identifier.',
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    pre: []
  },
  handler: (req, reply) => {
    console.log(req.params.id);
    return axios
      .get(configNext.get('URL_AUTH') + '/api/v2/users/' + encodeURI(req.params.id))
      .then(user =>
        reply({
          ...user.data,
          id: user.data._id
        })
      )
      .catch(err => reply.error(err));
  }
});
