/*
Create responses for requests with different urls based on validated then processed data

[s1] - Retrieve data about current URL
  [a] - Calculate page
  [b] - Read and store request variables if applicable
[s2] - Render templates based on current URL 
  [a] - Supply processed data to templates
  [b] - Try to render templates with data according to the calculated URL information
  [c] - Render response (catch and display errors)

*/
const fs = require('fs');
const pug = require('pug');

class DataResponder {

  constructor(req, res, processedData) {

    this.req            = req;
    this.res            = res;
    this.processedData  = processedData;
    //this._endResp(mainDirectoryPath);
    //;
    this._writeIndex();
    this._writeProjects();
    this._writeTools();
    this._writeToolListUrl();
    this._writeProjectListUrl();
    this._writeAssetUrls();
  }
  
  _endResp(data) {
    this.res.end(data);
  }

  _simpleResp(obj) {
    this.res.writeHead(obj.status, { 'Content-Type': obj.contentType });
    this._endResp(obj.data);
  }

  // Checks to see if the current url is */url or */url/
  _isUrl(url) {
    return (this.req.url === "/" + url || this.req.url === "/" + url + "/");
  }

  _isIndex() {
    return (this.req.url === "/" || this.req.url === "");
  }



  _writeIndex() {
    // Index pages
    if (this._isIndex()) {
      this.res.statusCode = 200;
      this.res.setHeader("Content-Type", "text/html");
      this._endResp(pug.renderFile(baseDirectoryPath + "/index.pug", this.processedData));
    }
  }

  // Create page for every element in array (www./slug/element-slug-1, www./slug/element-slug-2,www./slug/element-slug-3, etc...)
  _writeSingleType(slug, pugFilePath, elements) {
    var self = this;
    elements.forEach(e => {
      if (self._isUrl(slug + "/" + e.slug)) {
        self.res.statusCode = 200;
        self.res.setHeader("Content-Type", "text/html");
        self.processedData[slug] = e;
        self._endResp(pug.renderFile(baseDirectoryPath + pugFilePath, self.processedData));
      }
    });
  }

  _writeProjects() {
    this._writeSingleType("project", "/single-project.pug", this.processedData.projects);
  }

  // Create page for every tool (example.com/tool/slug and example.com/tool/slug/)
  _writeTools() {
    this._writeSingleType("tool", "/single-tool.pug", this.processedData.tools);
  }

  // Create page to display all the projects
  _writeProjectListUrl() {
    if (this._isUrl("projects")) {
      this.res.statusCode = 200;
      this.res.setHeader("Content-Type", "text/html");
      this._endResp(pug.renderFile(baseDirectoryPath + "/projects.pug", this.processedData));
    }
  }

  // Create page to display all the tools
  _writeToolListUrl() {
    if (this._isUrl("tools")) {
      this.res.statusCode = 200;
      this.res.setHeader("Content-Type", "text/html");
      this._endResp(pug.renderFile(baseDirectoryPath + "/tools.pug", this.processedData));
    }
  }

  _writeAssetUrls() {
    var self = this;
    this.processedData.assets.forEach(asset => {

      if (self._isUrl(asset.slug)) {
        fs.readFile(baseDirectoryPath + asset.path, function (err, data) {

          if (err) {
            self._simpleResp({
              contentType:  'text/html',
              status:       404,
              data:         "error"
            });
          }
          else {
            self._simpleResp({
              contentType:  asset.mime,
              status:       200,
              data:         data
            });
          }

        });
      }

    });
  }
}
exports.DataResponder = DataResponder;