const http = require('http');
const pug = require('pug');
const fs = require('fs');

const hostname = 'localhost';
const port = 8080;

var options       = require(__dirname + "/assets/json/options.json",  'utf8');
var projectsJson  = require(__dirname + "/assets/json/projects.json", 'utf8');
var toolsJson     = require(__dirname + "/assets/json/tools.json",    'utf8');


const server = http.createServer((req, res) => {

  if (req.url === "/" || req.url === ""){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const compiledPug = pug.renderFile(__dirname + "/index.pug", {
      options: options,
      tools: toolsJson,
      projects: projectsJson

    });
    res.end(compiledPug);
  }
  
  if (req.url === "/tools" || req.url === "/tools/"){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const compiledPug = pug.renderFile(__dirname + "/tools.pug", {
      options: options,
      tools: toolsJson
    });
    res.end(compiledPug);
  }

  if (req.url === "/style"){

   fs.readFile(__dirname + "/style.css", function(err, data) {
     if(err){
       res.writeHead(404);
       res.write("Not Found!");
     }
     else{
       res.writeHead(200, {'Content-Type': "text/css"});
       res.write(data);
     }
     res.end();
   });

  }
  
  if (req.url === "/bg"){

    fs.readFile(__dirname + "/assets/images/bg.SVG", function(err, data) {
      if(err){
        res.writeHead(404);
        res.write("Not Found!");
      }
      else{
        res.writeHead(200, {'Content-Type': "image/svg+xml"});
        res.write(data);
      }
      res.end();
    });
 
   }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(__filename);
  console.log(__dirname);
});