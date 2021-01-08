const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const webpack = require('webpack-stream');

let isDev = true;
let isProd = !isDev;

let webpackConfig = {
	output: {
		filename: 'main.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/' //исключения
			}
		]
	},
	mode: isDev ? 'development' : 'production'
};

function fonts() {
	return gulp.src('./app/fonts/*')
		.pipe(gulp.dest('./dist/fonts'));
}

function styles() {
	return gulp.src('./app/css/**/*.css')
		.pipe(concat('all.css'))
		.pipe(autoprefixer({
     	
     	overrideBrowserslist: ['> 0.01%'],
     	cascade: false
    }))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
}

function scripts() {
	return gulp.src('app/js/main.js')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
}

function img() {
	return gulp.src('./app/img/**/**/**/*')
		.pipe(imagemin([
	    imagemin.gifsicle({interlaced: true}),
	    imagemin.mozjpeg({progressive: true}),
	    imagemin.optipng({optimizationLevel: 5})
		]))
		.pipe(gulp.dest('./dist/img'))
}

function svg() {
	return gulp.src('app/img/*.svg')
		.pipe(gulp.dest('dist/img'));
}

function watch() {
	browserSync.init({
    server: {
      baseDir: './'
    }//,
    //proxy: 'test',
    //tunnel: true
  });
	gulp.watch('./app/css/**/*.css', styles);
	gulp.watch('./app/js/**/*.js', scripts);
	gulp.watch('./*.html', html);
}	

function clean() {
	return del(['dist/*']);
}

function html() {
	return gulp.src('*.html')
		.pipe(browserSync.stream());
}

gulp.task('styles', styles);
gulp.task('watch', watch);

gulp.task('img', img);

let build = gulp.series(clean,
			gulp.parallel(styles, scripts, img, svg, html, fonts)
			);

gulp.task('build', build);
gulp.task('dev', gulp.series('build', 'watch'));
