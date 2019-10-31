import Joi from 'joi';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/roles',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['update:groups']
    },
    description: 'Add one or more roles to a group.',
    tags: ['api'],
    validate: {
      options: {
        allowUnknown: false
      },
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
    const roles = req.payload;

    req.storage
      .getGroup(req.params.id)
      .then(group => {
        if (!group.roles) {
          group.roles = [];
        }

        roles.forEach(roleId => {
          if (group.roles.indexOf(roleId) === -1) {
            group.roles.push(roleId);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
