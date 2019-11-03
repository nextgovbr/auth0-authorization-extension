require('babel-register')();

const gulp = require('gulp');
const util = require('gulp-util');
const open = require('open');
const nodemon = require('gulp-nodemon');
const configNext = require('./configNext');

gulp.task('run', () => {
  nodemon({
    script: './build/webpack/server.js',
    ext: 'js json',
    env: {
      EXTENSION_SECRET: 'a-random-secret',
      AUTH0_RTA: 'https://auth0.auth0.com',
      AUTH0_DOMAIN: configNext.get('URL_AUTH'),
      NODE_ENV: 'development',
      WT_URL: configNext.get('URL'),
      BASE_URL: configNext.get('URL'),
      PUBLIC_WT_URL: configNext.get('URL')
    },
    ignore: [
      'assets/app/',
      'build/webpack',
      'server/data.json',
      'client/',
      'dist/',
      'tests/',
      'node_modules/'
    ]
  });
});
