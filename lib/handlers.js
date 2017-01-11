/**
 * Handler for vig.
 * @constructor
 */
function Handler(vig, app) {
  this.vig = vig;
  this.app = app;
}

/**
 * Add an handler.
 * @param {Object} handler - Handler for a request.
 */

Handler.prototype.add = function (handler) {
  this.handler = handler || {};
};

module.exports = Handler;
