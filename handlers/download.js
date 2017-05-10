'use strict';

const Promise = require('bluebird');

const components = require('attachments-components');
const FileNotFoundError = components.errors.FileNotFoundError;
const Ipfs = components.ipfs;
const logging = components.logging.getWrapperForModule('download');
const Metadata = components.metadata;
const settings = components.settings;

const CACHE_DURATION = settings.server.cache;

/**
 * Route handler for /dl/:hash/:filename.
 * @param  {Request}  request  HTTP request.
 * @param  {Response} response HTTP response.
 * @return {Promise}           Fulfills if response was successfully sent,
 *                             rejects if not.
 */
function download(request, response) {
  let ipfs = new Ipfs();
  let metadata = new Metadata();

  let hash = request.params.hash;

  let getStream = (record) => {
    return Promise.join(Promise.resolve(record), ipfs.serve(hash));
  };

  let sendResponse = (record, stream) => {
    response.writeHead(200, {
      'Cache-Control': `private, max-age=${CACHE_DURATION}`,
      'Content-Type': record.mimetype || 'application/octet-stream',
      'Last-Modified': Date.now(),
    });

    stream.pipe(response);
  };

  let send304Response = (mtime) => {
    response.writeHead(304, {
      'Last-Modified': mtime,
    });

    response.end();
  };

  let handleError = (error) => {
    if (error instanceof FileNotFoundError) {
      response.sendStatus(404);
    } else {
      response.sendStatus(500);
      logging.error(error);
    }
  };

  let modifiedSince = request.headers['if-modified-since'];
  if (modifiedSince) {
    return send304Response(Number(modifiedSince));
  } else {
    return metadata
      .getRecord(hash)
      .then(getStream)
      .spread(sendResponse)
      .catch(handleError);
  }
}

module.exports = download;
