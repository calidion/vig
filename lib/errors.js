/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var _ = require('lodash');
var fs = require('fs');
var common = require('errorable-common');
var Generator = require('errorable').Generator;

function Errors(locale) {
  this.errors = _.clone(common);
  this.locale = locale || 'zh-CN';
  this.files = [];
}

Errors.prototype.extends = function (file) {
  if (fs.existsSync(file)) {
    this.errors = _.merge(this.errors, require(file));
  }
};

Errors.prototype.add = function (file) {
  if (fs.existsSync(file)) {
    this.files.push(file);
  }
};

Errors.prototype.generate = function (locale) {
  locale = locale || this.locale;
  if (this.files && this.files.constructor === Array) {
    for (let i = 0; i < this.files.length; i++) {
      this.extends(this.files[i]);
    }
  }
  var generator = new Generator(this.errors, locale);
  return generator.errors;
};

module.exports = Errors;
