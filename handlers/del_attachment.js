'use strict';

const components = require('ipfs-images-components');
const Cleaner = components.cleaner;
const FileNotFoundError = components.errors.FileNotFoundError;
const logging = components.logging.getWrapperForModule('del_attachment');

/**
 * Route handler for /del/:hash/
 * @param  {Request}  request  HTTP request.
 * @param  {Response} response HTTP response.
 * @return {Promise}           Fulfills if response was successfully sent,
 *                             rejects if not.
 */
function delAttachment(request, response) {
  let cleaner = new Cleaner();
  let hash = request.params.hash;

  let sendResponse = () => {
    response.sendStatus(200);
  };

  let handleError = (error) => {
    if (error instanceof FileNotFoundError) {
      response.sendStatus(404);
    } else {
      response.sendStatus(500);
      logging.error(error);
    }
  };

  return cleaner
    .delAttachment(hash)
    .then(sendResponse)
    .catch(handleError);
}

module.exports = delAttachment;
