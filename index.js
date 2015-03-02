#!/usr/bin/env node
'use strict';
require('colors');
var fs = require('fs');
var http = require('http');
var marked = require('marked');
var template = require('./template');
var exts = require('markdown-extensions');

var isMarkdown = new RegExp('(' + exts.join('|') + ')$', 'i');

var filename = fs.readdirSync('.').filter(function(name) {
  return new RegExp('^readme.(' + exts.join('|') + ')$', 'i').test(name);
})[0];
if (!filename) {
  throw new Error('Failed to find a readme file');
}
var contents = fs.readFileSync(filename);

var parser = function(txt, callback) {
  marked(txt.toString(), {
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }, function (err, result) {
    callback(err, result);
  });
};

var server = http.createServer(function(req, resp) {
  try {
    if (isMarkdown.test(req.url)) {
      var isCurrentFile = new RegExp(filename, 'i').test(req.url);
      var txt = isCurrentFile ? contents : fs.readFileSync('.' + req.url);
      parser(txt, function(err, result) {
        resp.setHeader('Content-Type', 'text/html');
        result = err || template(result);
        resp.end(result);
      });
    }
    else {
      resp.end(fs.readFileSync('.' + req.url));
    }
  }
  catch (e) {
    resp.writeHead(404);
    resp.end(e.toString());
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

var padme = function(num) {
  return (num < 10) ? '0' + num : num;
}

function watcher(nextPayload) {
  var moment = nextPayload.mtime;

  var date = [
    moment.getFullYear(),
    padme(moment.getMonth()),
    padme(moment.getDay())
  ].join('/');

  var time = [
    padme(moment.getHours()),
    padme(moment.getMinutes()),
    padme(moment.getSeconds())
  ].join(':');

  console.log(date, time, 'Detected file change'.cyan)
  contents = fs.readFileSync(filename);
}

fs.watchFile(filename, {
  interval: 300
}, watcher);

server.on('close', function() {
  process.exit(0);
});

var closed = false;
function gracefulServerShutdown() {
  if (!closed) {
    closed = true;
    server.close();
  }
}

process
  .on('exit', gracefulServerShutdown)
  .on('SIGINT', gracefulServerShutdown)
  .on('uncaughtException', gracefulServerShutdown);
