require('colors');
var fs = require('fs');
var http = require('http');
var assert = require('assert');
var marked = require('marked');
var exec = require('child_process').exec;

var file = fs.readFileSync('README.md');

exec('node index');

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
          process.exit(1);
        }
        console.log('All tests passed'.green);
        process.exit(0);
      });
    });
  });
}, 1000);