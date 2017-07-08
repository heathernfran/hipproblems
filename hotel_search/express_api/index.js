const express = require('express')
const app = express()

const http = require('http')
const bodyParser = require('body-parser')
const engines = require('consolidate')

const localUrl = 'http://localhost:9000/scrapers/';
const providers = ['Expedia', 'Orbitz', 'Priceline', 'Travelocity', 'Hilton'];

app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  let results = []
  providers.forEach((item) => {
    results.push(getProviderData(item))
  });
  console.log(results);
  // res.send(`results: ${JSON.stringify(results, null, 2)}`)
  res.send(`results: ${results}`)
  // res.render('index', {results: results})
})

let server = app.listen(3000, () => console.log(`Server running at port ${server.address().port}`))


getProviderData = (url) => {

  let concatUrl = localUrl.concat(url);

  http.get(concatUrl, (response) => {
    const { statusCode } = response;

    let resultsArray = [];

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
        // resultsArray.push(rawData)
        let parsedData = JSON.parse(rawData)
        // console.log(parsedData)
        return parsedData
        // resultsArray.push(parsedData)
        // return resultsArray;
      } catch (e) {
        console.log(`Error on getting data: ${e}`)
      }
    });

  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}
