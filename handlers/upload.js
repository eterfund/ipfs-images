'use strict';

const fs = require('fs-extra');
const multiparty = require('multiparty');
const Promise = require('bluebird');

const components = require('ipfs-images-components');
const Ipfs = components.ipfs;
const logging = components.logging.getWrapperForModule('upload');
const Metadata = components.metadata;
const settings = components.settings;

Promise.promisifyAll(multiparty, {
  multiArgs: true,
});

const MAX_FILE_SIZE = settings.server.size;

/**
 * Route handler for /ul.
 * @param  {Request}  request  HTTP request.
 * @param  {Response} response HTTP response.
 * @return {Promise}           Fulfills if response was successfully sent,
 *                             rejects if not.
 */
function upload(request, response) {
  let ipfs = new Ipfs();
  let metadata = new Metadata();

  let file;
  let filename;
  let mimetype;
  let hash;
  let size;
  let tmpPath;

  let parseForm = () => {
    let form = new multiparty.Form();

    return form.parseAsync(request).spread((fields, files) => {
      if (typeof files.file !== 'object' || typeof files.file[0] !== 'object')
        throw new Error('Invalid input');

      file = files.file[0];
      filename = file.originalFilename;
      mimetype = file.headers['content-type'] || 'text/plain';
      size = file.size;
      tmpPath = file.path;

      if (size > MAX_FILE_SIZE) throw new Error('File is too big');
    });
  };

  let uploadToIpfs = () => {
    return ipfs.upload(file);
  };

  let addMetadata = (result) => {
    result = result[0];
    hash = result.hash;

    return metadata.addRecord(hash, mimetype, size);
  };

  let deleteFile = () => {
    return fs.unlink(tmpPath);
  };

  let sendResponse = () => {
    response.json({
      id: hash,
      filename: filename,
      mime: mimetype,
    });
  };

  let handleError = (error) => {
    response.sendStatus(500);
    logging.error(error);
  };

  return parseForm()
    .then(uploadToIpfs)
    .then(addMetadata)
    .then(sendResponse)
    .catch(handleError)
    .then(deleteFile)
    .catch((error) => logging.error(error));
}

module.exports = upload;
