const http = require('http');
const pug = require('pug');
const fs = require('fs');

const hostname = 'localhost';
const port = 8080;



const options       = require(__dirname + "/assets/json/options.json",  'utf8');
const projectsJson  = require(__dirname + "/assets/json/projects.json", 'utf8');
const toolsJson     = require(__dirname + "/assets/json/tools.json",    'utf8');










var processController = {

  allTools: [],
  normalTools: [],
  featuredTools: [],
  projectsJson: [],
  toolsJson: [],
  options: [],

  run: function(options, projectsJson, toolsJson){

    var self          = this;

    self.options      = options;
    self.toolsJson    = toolsJson;
    self.projectsJson = projectsJson;

    self.projectsJson.forEach(project => {
      
      project.tools = [];
    
    });
    
    self.toolsJson.forEach(tool => {
    
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
      
      if(tool.featured === false){
        self.normalTools.push(tool);
      }else{
        self.featuredTools.push(tool);
      }
    
    });
    
    self.allTools = self.featuredTools.concat(self.normalTools);

    self.allTools.sort     ((a, b) => a.order - b.order);
    self.normalTools.sort  ((a, b) => a.order - b.order);
    self.featuredTools.sort((a, b) => a.order - b.order);

  }
};


processController.run(options, projectsJson, toolsJson);











const server = http.createServer((req, res) => {

  // Index pages
  if (req.url === "/" || req.url === ""){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const compiledPug = pug.renderFile(__dirname + "/index.pug", {
      options: processController.options,
      tools: processController.allTools,
      projects: processController.projectsJson,
      featuredTools: processController.featuredTools,
      normalTools: processController.normalTools
    });
    res.end(compiledPug);
  }

  // Create page for every project (example.com/projects/slug and example.com/projects/slug/)
  processController.projectsJson.forEach(project => {
    
    const projectUrl = {
      "path": ("/projects/" + project.slug),
      "imagePath" : ("/projects/" + project.slug) + "/images/"
    }

    if(project.images){
      project.images.forEach(image =>{        
        // ex url: www/projects/lightshow/images/banner-225x150
        //         www/projects/lightshow/images/banner-225x150/

        const imageUrl = {
          "url" : (projectUrl.imagePath + image.slug), 
          "path": (__dirname + "/assets/projects/" + project.slug + "/images/" + image.path)
        };

        if (req.url === (imageUrl.url) || 
            req.url === (imageUrl.url) + "/"){

          fs.readFile(imageUrl.path, function(err, data) {
            if(err){
              res.writeHead(404);
              res.write("Not Found!");
            }
            else{
              res.writeHead(200, {'Content-Type': image.mime});
              res.write(data);
            }
            res.end();
          });     
        }
    
  
      });
    }
    
    if (req.url === (projectUrl.path) || 
        req.url === (projectUrl.path) + "/"){

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      const compiledPug = pug.renderFile(__dirname + "/single-project.pug", {
        options: processController.options,
        projects: processController.projectsJson,
        project: project
      });
      
      res.end(compiledPug);          
    }

  });
  

  // Create page for every tool (example.com/tools/slug and example.com/tools/slug/)
  processController.toolsJson.forEach(tool => {

    if (req.url === ("/tools/" + tool.slug) || 
        req.url === ("/tools/" + tool.slug) + "/"){

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        const compiledPug = pug.renderFile(__dirname + "/single-tool.pug", {
          options: processController.options,
          tools: processController.allTools,
          tool: tool,
          featuredTools: processController.featuredTools,
          normalTools: processController.normalTools
        });
        
        res.end(compiledPug);          
    }
  });

  // Create page to display all the projects
  if (req.url === "/projects" || req.url === "/projects/"){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const compiledPug = pug.renderFile(__dirname + "/projects.pug", {
      options: processController.options,
      projects: processController.projectsJson
    });
    res.end(compiledPug);
  }

  // Create page to display all the tools
  if (req.url === "/tools" || req.url === "/tools/"){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const compiledPug = pug.renderFile(__dirname + "/tools.pug", {
      options: processController.options,
      tools: processController.allTools,
      featuredTools: processController.featuredTools,
      normalTools: processController.normalTools
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