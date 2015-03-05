#!/usr/bin/env node
'use strict'
require('colors')
var fs = require('fs')
var http = require('http')
var marked = require('marked')
var template = require('./template')
var spawn = require('child_process').spawn
var highlighter = require('highlight.js').highlightAuto

var markdownExtensions = '(md|markdown|mdown|mkdn|mkd|mdwn|mkdown|ron)$'
var hasMarkdownExtension = new RegExp(markdownExtensions, 'i')

var readmeFiles = fs.readdirSync('.').filter(function(name) {
  return new RegExp('^readme.' + markdownExtensions, 'i').test(name)
})
var mainReadme = readmeFiles[0]
if (!mainReadme) {
  throw new Error('Failed to find a readme file')
}

var parseMarkdown = function(txt, callback) {
  marked(txt, {
    highlight: function (code) {
      return highlighter(code).value
    }
  }, function (err, result) {
    if (err) throw err
    callback(result)
  })
}

var getRelativeFile = function(path) {
  return fs.readFileSync('.' + path)
}
var globResponse = null

var server = http.createServer(function(req, resp) {
  var url = req.url

  try {
    if (hasMarkdownExtension.test(url)) {
      resp.setHeader('Content-Type', 'text/html')
      if (url.indexOf(mainReadme) >= 0 && globResponse) {
        globResponse = resp
      }
      else {
        parseMarkdown(getRelativeFile(url).toString(), function(result) {
          resp.end(template(result))
        })
        globResponse = true
      }
    }
    else {
      resp.end(getRelativeFile(url))
    }
  }
  catch(e) {
    resp.writeHead(404)
    resp.end(e.toString())
  }
})

server.listen(5678, 'localhost', function(err) {
  if (err) throw err
  var host = 'http://localhost:' + server.address().port + '/' + mainReadme
  spawn('open', [host])
  console.log('Server started on ' + host)
})

var formatDigit = function(num) {
  return num < 10 ? '0' + num : num
}

function watcher(nextPayload) {
  var moment = nextPayload.mtime
  var date = [
    moment.getFullYear(),
    formatDigit(moment.getMonth()),
    formatDigit(moment.getDay())
  ].join('/')
  var time = [
    formatDigit(moment.getHours()),
    formatDigit(moment.getMinutes()),
    formatDigit(moment.getSeconds())
  ].join(':')
  console.log(date, time, 'Detected file change'.cyan)

  var contents = fs.readFileSync(mainReadme)
  parseMarkdown(contents.toString(), function(result) {
    globResponse.end(template(result))
  })
}

fs.watchFile(mainReadme, {
  interval: 300
}, watcher)

var once = false
function gracefulServerShutdown() {
  if (!once) {
    console.log('\nreadme-server terminated'.red)
    once = true
    server.close()
    process.exit(0)
  }
}

process
  .on('exit', gracefulServerShutdown)
  .on('SIGINT', gracefulServerShutdown)
  .on('uncaughtException', gracefulServerShutdown)
