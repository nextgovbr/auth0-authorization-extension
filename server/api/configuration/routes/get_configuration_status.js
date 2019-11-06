import _ from 'lodash';

module.exports = server => ({
  method: 'GET',
  path: '/api/configuration/status',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['read:configuration']
    },
    pre: []
  },
  handler: (req, reply) =>
    reply({ rule: { exists: false, enabled: false }, database: { size: null, type: 'mongodb' } })
});
