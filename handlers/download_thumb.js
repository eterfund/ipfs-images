'use strict';

const Promise = require('bluebird');

const components = require('ipfs-images-components');
const FileNotFoundError = components.errors.FileNotFoundError;
const logging = components.logging.getWrapperForModule('download_thumb');
const Metadata = components.metadata;
const settings = components.settings;
const Thumbnail = components.thumbnail;

const CACHE_DURATION = settings.server.cache;

/**
 * Route handler for /dl/thumb/:size/:hash.
 * @param  {Request}  request  HTTP request.
 * @param  {Response} response HTTP response.
 * @return {Promise}           Fulfills if response was successfully sent,
 *                             rejects if not.
 */
function downloadThumb(request, response) {
  let metadata = new Metadata();
  let thumbnail = new Thumbnail();

  let size = Number(request.params.size);
  let hash = request.params.hash;

  let getStream = (record) => {
    return Promise.join(Promise.resolve(record), thumbnail.serve(hash, size));
  };

  let sendResponse = (record, stream) => {
    response.writeHead(200, {
      'Cache-Control': `private, max-age=${CACHE_DURATION}`,
      'Content-Type': 'image/jpeg',
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

module.exports = downloadThumb;
