var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    coffee = require('gulp-coffee'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    livereload = require('gulp-livereload'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    dest = 'build';


function watchSrc(srcfile, outfile) {
  var bundler = watchify();
  bundler.transform('coffeeify');
  bundler.require(srcfile, {expose: 'calculator'});
  
  bundler.on('update', rebundle);
  
  function rebundle() {
    return bundler.bundle()
      .pipe(source(outfile))
      .pipe(gulp.dest('./build/js'))
      .pipe(livereload());
  }
  return rebundle();
};

function watchSpec(srcfiles, outfile) {
  gulp.src(srcfiles)
    .pipe(watch(function(files) {
      return files.pipe(coffee().on('error', gutil.log))
          .pipe(rename('tests.js'))
          .pipe(gulp.dest('./build/js'))
          .pipe(livereload());
    }));
}

gulp.task('staticsvr', function(next) {
  var staticS = require('node-static'),
      server = new staticS.Server('./' + dest),
      port = 8000;
  require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      server.serve(request, response);
    }).resume();
  }).listen(port, function() {
    gutil.log('Server listening on port: ' + gutil.colors.magenta(port));
    next();
  });
});

gulp.task('default', ['staticsvr'], function() {
  watchSrc('./calculator.coffee', 'calculator.js');
  watchSpec('./spec/*.coffee', 'tests.js');
});
