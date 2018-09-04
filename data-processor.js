class DataProcessor {

  constructor(data) {

    this.allTools       = [];
    this.normalTools    = [];
    this.featuredTools  = [];
    this.options        = data.options;
    this.toolsJson      = data.tools;
    this.projectsJson   = data.projects;
    this.assetsJson     = data.assets;

    // tool->projects and project->tools should both be accessable object arrays after this is called
    this._bindToolsAndProjects();

    // Define the all tools array by combining featured and normal tools into one array
    this.allTools = this.featuredTools.concat(this.normalTools);

    // Sort by user defined order
    const sortf = (a, b) => a.order - b.order;

    this.allTools     .sort(sortf);
    this.normalTools  .sort(sortf);
    this.featuredTools.sort(sortf);

    this._addToAssets();
  }

  // Here, we loop through all of the slugs in the tool.projects array, 
  // find the matching project in the user defined projects array, 
  // and then replace the slug with that project object.
  _bindToolsAndProjects() {

    var self = this;
    self.toolsJson.forEach((tool) => {

      // Retrieve all projects from the user defined project array that have the same slug and associate them
      tool.projects.forEach((projectSlug, index) => {
        self.projectsJson.forEach(project => {

          if (project.slug === projectSlug) {
            if (!project.tools) {
              project.tools = [tool];
            }
            else {
              project.tools.push(tool);
            }

            tool.projects[index] = project;
          }

        });
      });

      // Add to featured or normal arrays
      if (tool.featured === false) {
        self.normalTools.push(tool);
      }
      else {
        self.featuredTools.push(tool);
      }
    });

  }

  // Add all project images to the assets array
  _addToAssets() {

    var self = this;
    // this.assetsJson
    this.projectsJson.forEach(project => {
      if (project.images) {
        project.images.forEach(image => {

          self.assetsJson.push({
            "mime": image.mime,
            "path": "/assets/projects/" + project.slug  + "/images/" + image.path,
            "slug": (("project/"        + project.slug) + "/images/" + image.slug)
          });

        });
      }
    });

  }

  getData() {
    return {
      options:        this.options,
      tools:          this.allTools,
      projects:       this.projectsJson,
      featuredTools:  this.featuredTools,
      normalTools:    this.normalTools,
      assets:         this.assetsJson
    };
  }
}

exports.DataProcessor = DataProcessor;