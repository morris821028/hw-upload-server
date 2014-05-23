/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path');
var engine = require('ejs-locals'),
  mime = require('mime'),
  fs = require('fs');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('ejs', engine);
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + "/public/uploads"
  })); // modify
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post("/upload", function(request, response) {
  // request.files will contain the uploaded file(s),
  // keyed by the input name (in this case, "file")

  // show the uploaded file name
  console.log("file name", request.files.file.name);
  console.log("file path", request.files.file.path);

  response.end("upload complete");
});
app.get('/download/:fileName', function(req, res) {

  var file = __dirname + '/uploads/' + req.params.fileName;

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});