'use strict';

const cookieParser = require('cookie-parser');
const cors = require('cors');
const getAuthFn = require('znakchat-auth');
const Router = require('express').Router;

const components = require('attachments-components');
const logging = components.logging.getWrapperForModule('routes');
const redis = components.redis;
const settings = components.settings;

const downloadThumb = require('./handlers/download_thumb');
const download = require('./handlers/download');
const upload = require('./handlers/upload');

const auth = getAuthFn(redis, settings.redis.prefix.sessions);

const corsOptions = {
  credentials: true,
  methods: 'GET, POST',
  optionsSuccessStatus: 200,
  origin: settings.server.headers.origin,
};

const preflight = Object.assign({}, corsOptions, {
  allowHeaders: 'X-Requested-With',
});

/**
 * Configures HTTP routes.
 * @param  {Express} app Express app.
 */
function routes(app) {
  app.use(cookieParser());
  app.options('*', cors(preflight));

  let authType = settings.server.auth;
  let authWrapper = (request, response, next) => {
    auth(request.cookies).then(() => next()).catch((error) => {
      if (error instanceof getAuthFn.AuthError) {
        response.sendStatus(403);
      } else {
        response.sendStatus(500);
        logging.error(error);
      }
    });
  };

  let router = new Router();
  if (authType === 'full') {
    router.use('/', authWrapper);
  } else if (authType === 'partial') {
    router.use('/ul', authWrapper);
  }
  app.use('/', router);

  app.use((request, response, next) => {
    logging.verbose(
      '[request] ' +
        request.protocol +
        '://' +
        request.get('host') +
        request.originalUrl
    );
    next();
  });

  app.get('/dl/thumb/:size/:hash', cors(corsOptions), (request, response) =>
    downloadThumb(request, response)
  );
  app.get('/dl/:hash/:filename', cors(corsOptions), (request, response) =>
    download(request, response)
  );
  app.post('/ul', cors(corsOptions), (request, response) =>
    upload(request, response)
  );
}

module.exports = routes;
