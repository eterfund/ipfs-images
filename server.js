'use strict';

const app = require('express')();
const path = require('path');
const http = require('http');

global.appRoot = path.resolve(__dirname);

const components = require('ipfs-images-components');
const logging = components.logging.getWrapperForModule('server');
const settings = components.settings;
const routes = require('./routes');

logging.info('Initialization');
let server = new http.Server(app);

app.use(function(req, res, next) {
  res.setHeader('Cache-Control', 'no-transform');
  next();
});

logging.info('Starting');
server.listen(settings.server.port);

routes(app);

logging.info('Started');
