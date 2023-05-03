const http = require('http');
const fs = require('fs');
const url = require('url');

http
  .createServer((request, response) => {
    let reqUrl = request.url;
    let urlQuery = url.parse(reqUrl, true);
    let filePath = '';

    fs.appendFile(
      'log.txt',
      'URL: ' + reqUrl + '\nTimestamp: ' + new Date() + '\n\n',
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added to log.');
        }
      }
    );

    if (urlQuery.pathname.includes('documentation')) {
      filePath = __dirname + '/documentation.html';
    } else {
      filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
    });
  })
  .listen(8080);
console.log('My test server is running on Port 8080.');
