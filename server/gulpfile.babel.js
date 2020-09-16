import del from 'del';
import gulp from 'gulp';
import path from 'path';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**', '!populate.js'],
  nonJs: ['./package.json', './.gitignore', './.eslintrc.json', '.babelrc'],
  tests: './tr4/**/tests/*.js',
};

// Clean up dist and coverage directory
gulp.task('clean',  gulp.series((done) => {
  del(['dist/**', 'coverage/**', '!dist', '!coverage']);
  done();
}));

// Copy non-js files to dist
gulp.task('copy', gulp.series((done) => {
  gulp.src(paths.nonJs, {allowEmpty: true})
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'));
  done();
}));

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', gulp.series((done) => {
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.',allowEmpty: true })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot (file) {
        return path.relative(file.path, __dirname);
      },
    }))
    .pipe(gulp.dest('dist'));
  done();
}));

// Start server with restart on file changes
gulp.task('nodemon', gulp.series('copy','babel', (done) => {
  done();
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel'],
  })
}));

// gulp serve for development
gulp.task('serve', gulp.series('clean',() => runSequence('nodemon')));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', gulp.series('clean', 'copy', 'babel',  (done) => {
  done();
}));
