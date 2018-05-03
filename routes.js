'use strict';

const cookieParser = require('cookie-parser');
const cors = require('cors');
const Router = require('express').Router;

const components = require('ipfs-images-components');
const logging = components.logging.getWrapperForModule('routes');
const settings = components.settings;

const auth = require('./auth');

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

  let authType = settings.server.auth.type;
  let allowedIPs = settings.server.auth.allowedIPs;
  let authWrapper = (request, response, next) => {
    auth(allowedIPs, request.ip).then(() => next()).catch((error) => {
      if (error instanceof auth.AuthError) {
        response.sendStatus(403);
      } else {
        response.sendStatus(500);
        logging.error(error);
      }
    });
  };

  const storage = settings.server.storage.type === 'ipfs' ? (
    new components.storageBackends.IpfsStorage(
      settings.server.storage.options.url
    )
  ) : new components.storageBackends.FilesystemStorage(
    settings.server.storage.options.basePath
  );
  const thumbnailsStorage = new components.thumbnail(storage);
  const metadata = new components.metadata();

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

  app.delete('/del/:hash', cors(corsOptions),
    components.handlers.delAttachment(storage)
  );
  app.get('/dl/thumb/:size/:hash', cors(corsOptions),
    components.handlers.downloadThumb(thumbnailsStorage, metadata, {
      CACHE_DURATION: settings.server.cache
    })
  );
  app.get('/dl/:hash/:filename', cors(corsOptions), 
    components.handlers.download(storage, metadata, {
      CACHE_DURATION: settings.server.cache
    })
  );
  app.post('/ul', cors(corsOptions),
    components.handlers.upload(storage, metadata, {
      MAX_FILE_SIZE: settings.server.size
    })
  );

  app.get('/api/integrity', cors(corsOptions), (request, response) =>
    checkIntegrity(request, response)
  );
}

module.exports = routes;
