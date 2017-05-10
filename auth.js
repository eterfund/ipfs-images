'use strict';

const components = require('attachments-components');
const logging = components.logging.getWrapperForModule('auth');

/**
 * Class represents custom Auth error.
 * @extends Error
 */
class AuthError extends Error {
  /**
   * Create an instance of error.
   * @param {String} message Error message.
   */
  constructor(message) {
    super();

    this.message = message;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication function tests request IP agains a set of allowed IPs.
 * @param  {String[]} ips Array of regexps of allowed IPs.
 * @param  {String}   ip  Request IP.
 * @return {Promise}      Promise resolves with True if authentication was
 *                        successful or rejects with AuthError otherwise.
 */
function auth(ips, ip) {
  return new Promise((resolve, reject) => {
    ips.some((regexp) => {
      logging.verbose(`Matching ${ip} against ${regexp}`);

      if (ip.match(regexp)) {
        logging.verbose(`Match found for ${ip} against ${regexp}`);
        resolve(ip);
        return true;
      }
    });

    reject(new AuthError(`No match found for ${ip}`));
  });
}

module.exports = auth;
module.exports.AuthError = AuthError;
