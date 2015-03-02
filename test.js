require('colors');
var fs = require('fs');
var http = require('http');
var assert = require('assert');
var marked = require('marked');
var exec = require('child_process').exec;
// Stop browser being launched when testing
require('child_process').spawn = function() {};

var file = fs.readFileSync('README.md');

var index = exec('node index');

setTimeout(function() {
  http.get('http://localhost:5678/README.md', function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      marked(file.toString(), {
        highlight: function (code) {
          return require('highlight.js').highlightAuto(code).value;
        }
      }, function (err, result) {
        try {
          assert.equal(data.indexOf(result) > 0, true);
        }
        catch (e) {
          console.log('Failure'.red);
          console.log('From server:'.yellow, data);
          console.log('Parsed markdown:'.yellow, result);
          index.kill();
        }
        console.log('All tests passed'.green);
        index.kill();
      });
    });
  });
}, 1000);
