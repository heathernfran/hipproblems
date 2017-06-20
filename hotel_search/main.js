const path = require('path');
const http = require('http');
const port = 8000;

const localUrl = 'http://localhost:9000/scrapers/';
const providers = ['Expedia', 'Orbitz', 'Priceline', 'Travelocity', 'Hilton'];

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  console.log(`Created server`);
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
  path.resolve('/main.js', '/hotels/search');
  providers.forEach((item) => {
    getProviderData(item);
  });
});

function getProviderData(url) {

  let concatUrl = localUrl.concat(url);

  http.get(concatUrl, (response) => {
    const { statusCode } = response;
    
    let error;
    if (statusCode != 200) {
      error = new Error(`Request failed. Status Code: ${statusCode}`);
    }
    if (error) {
      console.log(`Error occurred: ${error}`);
      response.resume();
      return;
    }
    
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => { rawData += chunk; });
    response.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
      } catch (e) {
        console.log(`Error on getting data: ${e}`)
      }
    });
    
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}
