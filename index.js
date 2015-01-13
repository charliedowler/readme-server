#!/usr/bin/env node
'use strict';
var fs = require('fs');
var http = require('http');
var marked = require('marked');
var template = require('./template');

var isMarkdown = /(.md|.markdown)$/i;

var filename = fs.readdirSync('.').filter(function(name) {
  return /^readme(.md|.markdown)$/i.test(name);
})[0];
if (!filename) {
  throw new Error('Failed to find a readme file');
}
var contents = fs.readFileSync(filename);
var changed = true;

var parser = function(txt, callback) {
  marked(txt.toString(), {
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }, function (err, result) {
    callback(result);
  });
};

var server = http.createServer(function(req, resp) {
  try {
    if (isMarkdown.test(req.url)) {
      var isCurrentFile = new RegExp(filename, 'i').test(req.url);
      var txt = isCurrentFile ? contents : fs.readFileSync('.' + req.url);
      parser(txt, function(result) {
        resp.setHeader('Content-Type', 'text/html');
        result = template(result);
        if (isCurrentFile && changed) {
          changed = false;
        }
        else if (isCurrentFile) {
          resp.writeHead(304);
        }
        resp.end(result);
      });
    }
    else {
      resp.end(fs.readFileSync('.' + req.url));
    }
  }
  catch (e) {
    resp.writeHead(404);
    resp.end();
  }
  return true;
});

var spawn = require('child_process').spawn;
server.listen(5678, 'localhost', function(err) {
  if(err) {
    throw err;
  }
  var host = ['http://localhost:' + server.address().port + '/' + filename];
  spawn('open', host);
  console.log('Server started on ' + host.join(''));
});

fs.watchFile(filename, {
  interval: 300
}, function() {
  changed = true;
  contents = fs.readFileSync(filename);
});