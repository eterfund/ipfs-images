'use strict';

const components = require('attachments-components');
const Pin = components.pin;
const FileNotFoundError = components.errors.FileNotFoundError;
const logging = components.logging.getWrapperForModule('check_integrity');

/**
 * Route handler for /api/integrity/
 * @param  {Request}  request  HTTP request.
 * @param  {Response} response HTTP response.
 * @return {Promise}           Fulfills if response was successfully sent,
 *                             rejects if not.
 */
function checkIntegrity(request, response) {
  let pinner = new Pin();
  let hash = request.params.hash;

  let sendResponse = (result) => {
    response.send(JSON.stringify(result));
  };

  let handleError = (error) => {
    if (error instanceof FileNotFoundError) {
      response.sendStatus(404);
    } else {
      response.sendStatus(500);
      logging.error(error);
    }
  };

  return pinner
    .check()
    .then(sendResponse)
    .catch(handleError);
}

module.exports = checkIntegrity;
