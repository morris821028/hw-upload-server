/*
 * GET home page.
 */
function travel(dir, callback, finish) {
	var fs = require('fs'),
		path = require('path');
	fs.readdir(dir, function(err, files) {
		(function next(i) {
			if (i < files.length) {
				var pathname = path.join(dir, files[i]);

				fs.stat(pathname, function(err, stats) {
					if (stats.isDirectory()) {
						travel(pathname, callback, function() {
							next(i + 1);
						});
					} else {
						callback(pathname, function() {
							next(i + 1);
						});
					}
				});
			} else {
				finish && finish();
			}
		}(0));
	});
}
exports.index = function(req, res) {
	var dir = "public/uploads";
	var filesList = [];
	var filesKind = [];
	var mime = require('mime');

	travel(dir, function(pathname, callback) {
		console.log("found " + pathname);
		var regex = /\\/g;
		var kind = mime.lookup(pathname.substr(6).replace(regex, "/"));
		console.log(kind);
		filesKind.push(kind);
		filesList.push(pathname.substr(6).replace(regex, "/"));
		callback();
	}, function() {
		console.log("List " + filesList);
		res.render('index', {
			title: 'Express',
			filesList: filesList,
			filesKind: filesKind
		});
	});
};