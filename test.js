require('colors');
var fs = require('fs');
var http = require('http');
var assert = require('assert');
var marked = require('marked');

var file = fs.readFileSync('README.md');

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
      assert.equal(data.indexOf(result) > 0, true);
      console.log('All tests passed'.green);
    });
  });
});
