var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2'),
    uglify = require('gulp-uglify'),
    sequence = require('run-sequence'),
    del = require('del'),
    concat = require('gulp-concat'),
    path = require("path"),
    typedoc = require("gulp-typedoc");

gulp.task('lib', function() {
    var tsResult = gulp.src('./src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            out: 'dijon.js',
            target: "ES5",
            module: "system",
            emitError: false,
            declaration: true,
            sortOutput:true,
            removeComments: true
        }))
        
	return merge([
		tsResult.dts.pipe(gulp.dest('.')),
		tsResult.js
            .pipe(concat('dijon.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('build'))
	]);
})

gulp.task('uglify', function() {
    return gulp.src('build/dijon.js')
        .pipe(concat('dijon.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('addons', function() {
    return gulp.src('src/dijon.addons.js')
        .pipe(gulp.dest('build'));
})

gulp.task('clean', function() {
    return del([
        './build'
    ], {
            force: true
        });
});

gulp.task('combine', function() {
    return gulp.src('./src/**/*.ts')
        .pipe(concat('dijon.ts'))
        .pipe(gulp.dest('./src/dijon'));
});

gulp.task('compile', function(done) {
    return sequence('clean', 'lib', 'uglify', 'addons', done);
});

gulp.task('default', function(done) {
    return sequence('compile', 'watch', done);
});

gulp.task('watch', function(){
    gulp.watch(['src/**/*.ts'], ['compile']);
    gulp.watch(['src/dijon.addons.js'], ['compile']);
})

var typedoc = require("gulp-typedoc");

gulp.task("docs", function() {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            // TypeScript options (see typescript docs) 
            mode: "file",
            module: "commonjs",
            target: "es5",
            includeDeclarations: false,
            // Output options (see typedoc docs) 
            out: "./docs",
            // TypeDoc options (see typedoc docs) 
            name: "Relish Dijon Library",
            ignoreCompilerErrors: false,
            version: true
        }));
});