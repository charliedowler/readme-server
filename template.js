var fs = require('fs');

module.exports = {
  head: fs.readFileSync('templates/head.html'),
  footer: fs.readFileSync('templates/footer.html')
};