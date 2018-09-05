baseDirectoryPath = __dirname;

const hostname          = 'localhost';
const port              = 8080;
const http              = require('http');

const { DataProcessor } = require('./logic/data-processor');
const { DataResponder } = require('./logic/data-responder');
//const { DataValidator } = require('./logic/data-validator');

var data = {
  options:  require(__dirname + "/assets/json/options.json",  'utf8'),
  projects: require(__dirname + "/assets/json/projects.json", 'utf8'),
  tools:    require(__dirname + "/assets/json/tools.json",    'utf8'),
  assets:   require(__dirname + "/assets/json/assets.json",   'utf8')
};

const dataProcessor     = new DataProcessor(data);
const processedData     = dataProcessor.getData();

const server = http.createServer((req, res) => {
  
  new DataResponder(req, res, processedData);

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(__filename);
  console.log(__dirname);
});