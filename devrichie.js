const http = require('http');
const pug = require('pug');
const fs = require('fs');

const hostname = 'localhost';
const port = 8080;

const options       = require(__dirname + "/assets/json/options.json",  'utf8');
const projectsJson  = require(__dirname + "/assets/json/projects.json", 'utf8');
const toolsJson     = require(__dirname + "/assets/json/tools.json",    'utf8');




projectsJson.forEach(project => {
      
  project.tools = [];

});

toolsJson.forEach(tool => {

  var projectSlugs = tool.projects;
  var toolsProjects = [];

  projectSlugs.forEach(projectSlug => {

    projectsJson.forEach(project => {
      
      if(project.slug === projectSlug){
        toolsProjects.push(project);
        project.tools.push(tool);
      }

    });

  });


  tool.projects = toolsProjects;

});



const server = http.createServer((req, res) => {

  // Index pages
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

  // Create page for every project (example.com/projects/slug and example.com/projects/slug/)
  projectsJson.forEach(project => {

    
    if (req.url === ("/projects/" + project.slug) || 
        req.url === ("/projects/" + project.slug) + "/"){

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      const compiledPug = pug.renderFile(__dirname + "/single-project.pug", {
        options: options,
        projects: projectsJson,
        project: project
      });
      
      res.end(compiledPug);          
    }
  });
  

  // Create page for every tool (example.com/tools/slug and example.com/tools/slug/)
  toolsJson.forEach(element => {

    if (req.url === ("/tools/" + element.slug) || 
        req.url === ("/tools/" + element.slug) + "/"){

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        const compiledPug = pug.renderFile(__dirname + "/single-tool.pug", {
          options: options,
          tools: toolsJson,
          tool: element
        });
        
        res.end(compiledPug);          
    }
  });

  // Create page to display all the projects
  if (req.url === "/projects" || req.url === "/projects/"){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const compiledPug = pug.renderFile(__dirname + "/projects.pug", {
      options: options,
      projects: projectsJson
    });
    res.end(compiledPug);
  }

  // Create page to display all the tools
  if (req.url === "/tools" || req.url === "/tools/"){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const compiledPug = pug.renderFile(__dirname + "/tools.pug", {
      options: options,
      tools: toolsJson
    });
    res.end(compiledPug);
  }


  // Create style and script for loading styles and client side js
  // TODO: Below are all 'assets' which will be moved to an asset loader function
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

  if (req.url === "/script"){
    fs.readFile(__dirname + "/script.js", function(err, data) {
      if(err){
        res.writeHead(404);
        res.write("Not Found!");
      }
      else{
        res.writeHead(200, {'Content-Type': "application/javascript"});
        res.write(data);
      }
      res.end();
    });

  }
  
  if (req.url === "/bg"){
    fs.readFile(__dirname + "/assets/images/bg.svg", function(err, data) {
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