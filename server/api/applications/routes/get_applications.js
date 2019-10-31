import _ from 'lodash';
import multipartRequest from '../../../lib/multipartRequest';

module.exports = server => ({
  method: 'GET',
  path: '/api/applications',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['read:applications']
    },
    pre: []
  },
  handler: (req, reply) =>
    reply([
      {
        name: 'Prefeituras',
        callbacks: [
          'https://santabarbaradoeste.prefeituras.net/callback',
          'http://prefeitura:4200/callback',
          'https://qa.prefeituras.net',
          'https://dev.prefeituras.net/callback',
          'https://chapeco.prefeituras.net/callback',
          'https://producao.prefeituras.net/callback',
          'https://barretos.prefeituras.net/callback',
          'http://barretos.prefeituras.net/callback',
          'https://qualidade.prefeituras.net/callback',
          'https://xangrila.prefeituras.net/callback',
          'https://curitibanos.prefeituras.net/callback',
          'https://cascavel.prefeituras.net/callback',
          'https://modelo.prefeituras.net/callback',
          'https://mogidascruzes.prefeituras.net/callback',
          'https://joinville.prefeituras.net/callback',
          'https://cidade.prefeituras.net/callback',
          'https://mafra.prefeituras.net/callback',
          'https://yc.prefeituras.net/callback',
          'https://publica.prefeituras.net/callback',
          'https://sedema.prefeituras.net/callback',
          'https://itajai.prefeituras.net/callback'
        ],
        client_id: '2KsXIYG8GscSjzAjCzB8OLvYvddtAXwe',
        app_type: 'spa'
      }
    ])
});
