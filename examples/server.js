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
var responseTime = require('response-time');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.engine('ejs', engine);
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(responseTime(20));
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + "/uploads",
    defer: true
  })); // modify
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post("/", function(req, res) {
  // request.files will contain the uploaded file(s),
  // keyed by the input name (in this case, "file")

  // show the uploaded file name
  // console.log("file name", request.files.file.name);
  // console.log("file path", request.files.file.path);
  req.form.on('progress', function(bytesReceived, bytesExpected) {
    console.log(((bytesReceived / bytesExpected) * 100) + "% uploaded");
  });
  req.form.on('end', function() {
    //  console.log(req.files);
    res.send("done");
  });
});
app.get('/uploads/:fileName', function(req, res) {

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