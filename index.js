#!/usr/bin/env node
'use strict';
var fs = require('fs');
var http = require('http');
var marked = require('marked');
var template = require('./template');

var filename = fs.readdirSync('.').filter(function(name) {
  return /readme/i.test(name) && /(.md|.markdown)/i.test(name);
})[0];
if (!filename) {
  throw new Error('Failed to find a readme file');
}
var contents = fs.readFileSync(filename);
var changed = true;

var server = http.createServer(function(req, resp) {
  if (req.url !== '/') {
    // Attempt to load images
    try {
      resp.end(fs.readFileSync('.' + req.url));
    }
    catch (e) {
      resp.writeHead(404);
      resp.end();
    }
    return true;
  }
  marked(contents.toString(), {
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }, function (err, result) {
    resp.setHeader('Content-Type', 'text/html');
    result = template(result);
    if (changed) {
      changed = false;
    }
    else {
      resp.writeHead(304);
    }
    resp.end(result);
  });
});

var spawn = require('child_process').spawn;
server.listen(5678, 'localhost', function(err) {
  if(err) {
    throw err;
  }
  var host = ['http://localhost:' + server.address().port + '/'];
  spawn('open', host);
  console.log('Server started on ' + host.join(''));
});

fs.watchFile(filename, {
  interval: 300
}, function() {
  changed = true;
  contents = fs.readFileSync(filename);
});