var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var connect = require('gulp-connect');

var paths = {
	pages: ['src/*html']
};

var watchedBrowserify = watchify(browserify({
		basedir: ".",
		debug: true,
		entries: ['src/main.ts'],
		cache: {},
		packageCache: {}
	}).plugin(tsify));


gulp.task("copy-html", function() {
	return gulp.src(paths.pages)
			.pipe(gulp.dest("dist"));
});

gulp.task('webserver', function() {
	console.log("server: http://localhost:8080/");
	
	connect.server({
		livereload: true,
		root: 'dist'
	});
});

var bundle = function() {
	return watchedBrowserify
	.bundle()
	.pipe(source("bundle.js"))
	.pipe(gulp.dest("dist"));
}


var budo = require("budo");
gulp.task('default', ["copy-html", "webserver"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);


/*var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");


gulp.task("default", function() {
	return tsProject.src()
			.pipe(tsProject())
			.js.pipe(gulp.dest("dist"));
});*/



/*var budo = require("budo");
gulp.task('default', ["copy-html", "browserify"], function(cb) {
	budo('./dist/bundle.js', {
		live: true,             // live reload
		stream: process.stdout, // log to stdout
		port: 1773,             // use this as the base port
		open: true,
	}).on('connect', function(ev) {
		console.log("yes it is calling...");
	})
	.on('exit', cb)
})*/