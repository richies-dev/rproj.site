// Global used in data responder for base path of application
baseDirectoryPath = __dirname; 

const hostname          = 'localhost';
const port              = 8080;
const http              = require('http');

const { ErrorHandler }  = require('./logic/error-handler');
const { DataProcessor } = require('./logic/data-processor');
const { DataResponder } = require('./logic/data-responder');
const { DataValidator } = require('./logic/data-validator');

var options =  require(__dirname + "/assets/json/options.json",  'utf8');

var data = {
  projects: require(__dirname + "/assets/json/projects.json", 'utf8'),
  tools:    require(__dirname + "/assets/json/tools.json",    'utf8'),
  assets:   require(__dirname + "/assets/json/assets.json",   'utf8')
};

var   errorHandler      = new ErrorHandler();
const dataValidator     = new DataValidator(data, errorHandler);
const dataProcessor     = new DataProcessor(dataValidator.validatedData, errorHandler);

const server = http.createServer((req, res) => {
  
  new DataResponder(req, res, dataProcessor.processedData, options, errorHandler);

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(__filename);
  console.log(__dirname);
});