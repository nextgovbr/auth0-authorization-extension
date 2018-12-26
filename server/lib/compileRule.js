import ejs from 'ejs';
import config from './config';
import generateApiKey from './generateApiKey';
import authorizeRule from './rules/authorize';

export default (storage, auth0, configuration = { }, userName = '') =>
  storage.getApiKey()
    .then((key) => {
      if (!key) {
        return generateApiKey(storage, auth0);
      }

      return null;
    })
    .then(() =>
      ejs.render(authorizeRule, {
        extensionUrl: config('PUBLIC_WT_URL').replace(/\/$/g, ''),
        updateTime: () => new Date().toISOString(),
        config: configuration,
        userName
      })
    );
