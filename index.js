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

var getRelativeFile = function(path) {
  return fs.readFileSync('.' + path);
};
var globResponse = null;

var server = http.createServer(function(req, resp) {
  var url = req.url;

  try {
    if (isMarkdown.test(url)) {
      resp.setHeader('Content-Type', 'text/html');
      if (url.indexOf(filename) >= 0 && globResponse) {
        globResponse = resp;
      }
      else {
        parser(getRelativeFile(url), function(err, result) {
          if (err) throw err;
          resp.end(template(result));
        });
        globResponse = true;
      }
    }
    else {
      resp.end(getRelativeFile(url));
    }
  }
  catch(e) {
    resp.writeHead(404);
    resp.end(e.toString());
  }
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

  console.log(date, time, 'Detected file change'.cyan);
  var contents = fs.readFileSync(filename);
  parser(contents, function(err, result) {
    if (err) throw err;
    globResponse.end(template(result));
  });
}

fs.watchFile(filename, {
  interval: 300
}, watcher);

var closed = false;
function gracefulServerShutdown() {
  if (!closed) {
    closed = true;
    server.close();
  }
  process.exit(0);
}

process
  .on('exit', gracefulServerShutdown)
  .on('SIGINT', gracefulServerShutdown)
  .on('uncaughtException', gracefulServerShutdown);