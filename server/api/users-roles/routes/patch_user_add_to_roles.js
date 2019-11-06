import _ from 'lodash';
import Promise from 'bluebird';
import Joi from 'joi';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/users/{id}/roles',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['update:roles']
    },
    description: 'Add a single user to roles.',
    tags: ['api'],
    validate: {
      params: {
        id: Joi.string().required()
      },
      payload: Joi.array()
        .items(Joi.string())
        .required()
        .min(1)
    }
  },
  handler: (req, reply) => {
    const roleIds = req.payload;
    const pattern = /^(\{{0,1}([0-9a-fA-F]){8}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){12}\}{0,1})$/;
    const searchBy = '_id';

    req.storage
      .getRoles()
      .then(roles => {
        return _.filter(roles, role => {
          return _.includes(roleIds, role[searchBy].toString());
        });
      })
      .then(filtered => {
        return Promise.each(filtered, role => {
          if (!role.users) {
            role.users = []; // eslint-disable-line no-param-reassign
          }
          if (role.users.indexOf(req.params.id) === -1) {
            role.users.push(req.params.id);
          }
          console.log(role._id, role);
          return req.storage.updateRole(role._id, role);
        });
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
