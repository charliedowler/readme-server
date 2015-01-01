'use strict';
var head = require('./templates/head');
var poll = require('./templates/poll');
var styles = require('./templates/styles');
var footer = require('./templates/footer');

module.exports = function(content) {
  return [head, content, poll, styles, footer].join('');
};