var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var exec = require('child_process').exec;
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    pages: ["root.html"]
};
var tsProject = typescript.createProject('../server/tsconfig.json');
gulp.task("copy-html", function () {
    return gulp.src(paths.pages).pipe(gulp.dest("../server/public"));
});
// gulp.task("compile-server", function () {
//     return gulp.src(paths.server).plugin(tsify).pipe(gulp.dest("dist"));
// })
gulp.task(
    "default",
    gulp.series(gulp.parallel("copy-html"), function () {
        return browserify({
            basedir: ".",
            debug: true,
            entries: ["src/root.ts"],
            cache: {},
            packageCache: {},
        })
            .plugin(tsify)
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("../server/public"));
    }, function () {
        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject()).js
            .pipe(sourcemaps.write({
                // Return relative source map root directories per file.
                sourceRoot: "../server/out/maps"
            }))
            .pipe(gulp.dest("../server/out"))
    }, function () {
        return gulp
            .src("stylesheet.css")
            .pipe(gulp.dest("../server/public"));
    })
);
// gulp.task('server', function (cb) {
//     exec('node app.js', function (err, stdout, stderr) {
//         console.log(stdout);
//         console.log(stderr);
//         cb(err);
//     });
// });