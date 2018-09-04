const pug = require('pug');
const fs = require('fs');

class UrlWriter {

  constructor(req, res, processedData) {

    this.req            = req;
    this.res            = res;
    this.processedData  = processedData;

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
      this._endResp(pug.renderFile(__dirname + "/index.pug", this.processedData));
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
        self._endResp(pug.renderFile(__dirname + pugFilePath, self.processedData));
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
      this._endResp(pug.renderFile(__dirname + "/projects.pug", this.processedData));
    }
  }

  // Create page to display all the tools
  _writeToolListUrl() {
    if (this._isUrl("tools")) {
      this.res.statusCode = 200;
      this.res.setHeader("Content-Type", "text/html");
      this._endResp(pug.renderFile(__dirname + "/tools.pug", this.processedData));
    }
  }

  _writeAssetUrls() {
    var self = this;
    this.processedData.assets.forEach(asset => {

      if (self._isUrl(asset.slug)) {
        fs.readFile(__dirname + asset.path, function (err, data) {

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
exports.UrlWriter = UrlWriter;