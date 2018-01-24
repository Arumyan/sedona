const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const stylus = require('gulp-stylus');
const cssmin = require('gulp-cssmin');
const svgSprite = require('gulp-svg-sprites');
const svgmin = require('gulp-svgmin');


/* -------- Server  -------- */
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9001,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ------------ Pug compile ------------- */
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.styl')
    .pipe(plumber())
	.pipe(stylus())
    .pipe(prefixer())
    .pipe(gcmq())
    .pipe(gulp.dest('build/css'))
    .pipe(sourcemaps.init())
	.pipe(cssmin())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));
});

/* --------  js -------- */
gulp.task('js', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'source/js/main.js'
        ])
		.pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});
/* ------------ Sprite ------------- */
gulp.task('sprite', function(cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.styl'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

/* SVG SPRITES*/
gulp.task('spriteSvg', () => {
  return gulp.src('source/images/svg/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    //.pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
        mode: "symbols",
        preview: false,
        selector: "%f",
        svg: {
          symbols: 'sprite-svg.svg'
        }
      }
    ))
    .pipe(gulp.dest('source/images/'));
});


/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.styl', gulp.series('styles:compile'));
  gulp.watch('source/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'js', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
  )
);