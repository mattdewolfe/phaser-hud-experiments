/*
 *  gulpfile.js
 *  ===========
 */
var pkg = require('./package.json'),
    Buffer = require('buffer').Buffer,
    gulp = require('gulp'),
    bump = require('gulp-bump'),
    fs = require('fs'),
    _ = require('underscore'),
    glob = require("glob"),
    path = require('path'),
    del = require('del'),
    gulpif = require('gulp-if'),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    browserSync = require('browser-sync'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    gutil = require('gulp-util'),
    processhtml = require('gulp-processhtml'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed'),
    replace = require('gulp-replace-task'),
    sequence = require('run-sequence'),
    exec = require('gulp-exec'),
    process = require('child_process').exec,
    tinypng = require('gulp-tinypng-compress'),
    xml2js = require('gulp-xml2js'),
    change = require('gulp-change'),
    argv = require('yargs').argv,
    jsoncombine = require("gulp-jsoncombine"),
    jsonFormat = require('gulp-json-format'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    gulp_jspm = require("gulp-jspm"),
    // are we building for production
    isProduction = false,
    // globals
    versionPattern = 'version',
    namePattern = 'name',
    descPattern = 'desc',
    // paths
    paths = {
        PRODUCTION: '../dist',
        DEBUG: '../debug',
        SRC: './src',
        LESS: './src/less',
        FONTS: './src/fonts',
        DATA: './src/data/*',
        SCRIPTS: './src/scripts/',
        JS: './src/js/'
    };
/*********************************
 * ERROR HANDLING / DEBUGGING *
 ********************************/
function handleErrors() {
    return plumber(function() {
        var args = [].slice.apply(arguments);

        // Send error to notification center with gulp-notify
        notify.onError({
            title: "Compile Error",
            message: "<" + "%= error.message %" + ">"
        }).apply(this, args);

        // Keep gulp from hanging on this task
        this.emit('end');
    });
}

function logChanges(event) {
    return gutil.log(
        gutil.colors.green('File ' + event.type + ': ') +
        gutil.colors.magenta(path.basename(event.path))
    );
}

/*********************************
 * VERSIONING / CACHE BUSTING *
 ********************************/
function getPackageJson() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

function versionReplace() {
    pkg = getPackageJson();
    return replace({
        patterns: [{
            match: versionPattern,
            replacement: pkg.version
        }, {
                match: descPattern,
                replacement: pkg.description
            }, {
                match: namePattern,
                replacement: pkg.name
            }]
    });
}

gulp.task('bump', function(done) {
    if (!isProduction && (!argv.v || argv.v === undefined)) {
        return done();
    }
    var bumpType = { type: 'prerelease' }; // default to prelease
    if (argv.v) {
        bumpType = { version: argv.v }
    }
    if (argv.release) {
        bumpType.type = 'major';
    } else if (argv.minor) {
        bumpType.type = 'minor';
    } else {
        bumpType.type = 'patch';
    }
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump(bumpType))
        .pipe(gulp.dest('./'));
});

/***********************************
 * GETS PRODUCTION / DEBUG BUILD  *
 * PATH DEPENDING ON GULP COMMAND *
 **********************************/
function getBuildPath() {
    return isProduction ? paths.PRODUCTION : paths.DEBUG;
}

/*********************************
 * SCRIPTS *
 ********************************/
gulp.task('typescript', function() {
    return gulp.src('./src/scripts/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            out: 'app.js',
            target: "ES5",
            module: "system",
            emitError: false,
            declaration: false,
            removeComments: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/js'));
});

gulp.task('movejs', function() {
    return gulp.src(['./src/js/app.js', './src/js/app.js.map'])
        .pipe(versionReplace())
        .pipe(gulp.dest(getBuildPath() + '/assets/js'));
});

gulp.task('uglify', ['jspm_bundle'], function() {
    return gulp.src([
        paths.JS + '/in.js',
        'bower_components/phaser/build/phaser.js',
        'submodules/dijon/build/dijon.addons.js',
        paths.JS + '/app.js',
        paths.JS + '/out.js'
    ])
        .pipe(concat('app.min.js'))
        .pipe(versionReplace())
        //.pipe(uglify())
        .pipe(gulp.dest(paths.PRODUCTION + '/assets/js'));
});

gulp.task("jspm_bundle", function() {
    return gulp.src('./src/scripts/bootstrap.ts')
        .pipe(gulp_jspm({ selfExecutingBundle: true, plugin: true, lowResSourceMaps: false }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest("./src/js"));
});

gulp.task('scripts', function(done) {
    if (isProduction) {
        return sequence('jspm_bundle', done)
    } else {
        return sequence('typescript', 'movejs', done)
    }
});

/*********************************
 * IMAGES *
 ********************************/
gulp.task('images', ['staticimages', 'spritesheets', 'animations']);

gulp.task('spritesheets', function() {
    return gulp.src('./src/img/spritesheets/output/*.{png,xml,json}')
        .pipe(changed(getBuildPath() + '/assets/img/spritesheets'))
        .pipe(gulp.dest(getBuildPath() + '/assets/img/spritesheets'));
});

gulp.task('staticimages', function() {
    return gulp.src('./src/img/static/*')
        .pipe(changed(getBuildPath() + '/assets/img'))
        .pipe(gulp.dest(getBuildPath() + '/assets/img'))
});

gulp.task('animations', function() {
    return gulp.src('./src/animations/*/*.*')
        .pipe(changed(getBuildPath() + '/assets/img/animations'))
        .pipe(gulp.dest(getBuildPath() + '/assets/img/animations'))
});

// image compression with tinypng
gulp.task('tinypng', function(done) {
    var seq = [];
    if (argv.static) {
        seq.push('tinypngStatic');
    }
    if (argv.sprite) {
        seq.push('tinypngSprite');
    }

    if (typeof argv.sprite === 'undefined' && typeof argv.static === 'undefined') {
        seq.push('tinypngStatic');
        seq.push('tinypngSprite');
    }

    return sequence.apply(null, seq);
});

gulp.task('tinypngStatic', function() {
    gulp.src('./src/img/static/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'aDctAfotm8P-duZS2ClsrqWT_aGqHGbG',
            sigFile: './src/img/.tinypng-static-sigs',
            sameDest: true,
            summarise: true,
            log: true
        }))
        .pipe(gulp.dest('./src/img/static/'));
});

gulp.task('tinypngSprite', function() {
    gulp.src('./src/img/spritesheets/output/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'aDctAfotm8P-duZS2ClsrqWT_aGqHGbG',
            sigFile: './src/img/.tinypng-sprite-sigs',
            sameDest: true,
            summarise: true,
            log: true
        }))
        .pipe(gulp.dest('./src/img/spritesheets/output/'));
});
/*********************************
 * LESS / CSS *
 ********************************/
gulp.task('css', function() {
    return gulp.src(paths.LESS + '/main.less')
        .pipe(handleErrors())
        .pipe(less())
        .pipe(concat(isProduction ? 'style.min.css' : 'style.css'))
        .pipe(gulp.dest(getBuildPath() + '/assets/css'));
});

/*********************************
 * HTML *
 ********************************/
gulp.task('html', function() {
    return gulp.src(paths.SRC + '/index.html')
        .pipe(versionReplace())
        .pipe(handleErrors())
        .pipe(gulpif(isProduction, processhtml()))
        .pipe(gulp.dest(getBuildPath()));
});

/*********************************
 * FONTS *
 ********************************/
gulp.task('fonts', function() {
    return gulp.src(paths.FONTS + '/**/*.{woff,woff2,svg,eot,ttf,otf}')
        .pipe(gulp.dest(getBuildPath() + '/assets/fonts'));
});

gulp.task('bitmapfonts', ['bitmapFontImages', 'bitmapAtlases']);

gulp.task('bitmapFontImages', function() {
    return gulp.src(paths.FONTS + '/bitmap/**/*.png')
        .pipe(gulp.dest(getBuildPath() + '/assets/fonts/bitmap'));
});

gulp.task('bitmapAtlases', function() {
    return gulp.src(paths.FONTS + '/bitmap/**/*.{fnt,xml}')
        .pipe(rename({ extname: '.xml' }))
        .pipe(xml2js({ explicitArray: false, mergeAttrs: true }))
        .pipe(change(parseJSONFont))
        .pipe(rename({ extname: '.json' }))
        .pipe(gulp.dest(getBuildPath() + '/assets/fonts/bitmap'));
})

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function parseJSONFont(content) {
    // phaser for some reason expects all these variables to be prepended by underscores in the font atlas json
    content = replaceAll('"face"', '"_face"', content);
    content = replaceAll('"size"', '"_size"', content);
    content = replaceAll('"lineHeight"', '"_lineHeight"', content);
    content = replaceAll('"id"', '"_id"', content);
    content = replaceAll('"x"', '"_x"', content);
    content = replaceAll('"y"', '"_y"', content);
    content = replaceAll('"width"', '"_width"', content);
    content = replaceAll('"height"', '"_height"', content);
    content = replaceAll('"xoffset"', '"_xoffset"', content);
    content = replaceAll('"yoffset"', '"_yoffset"', content);
    content = replaceAll('"xadvance"', '"_xadvance"', content);
    return content;
};

/*********************************
 * DATA *
 ********************************/
function combineGameJSON(data) {
    return new Buffer(JSON.stringify(data));
};

gulp.task('gamedata', function() {
    return gulp.src('./src/data/game/*.json')
        .pipe(jsoncombine('game_data.json', combineGameJSON))
        .pipe(jsonFormat(4))
        .pipe(gulp.dest('./src/data/'));
});

gulp.task('moveData', function() {
    return gulp.src([paths.SRC + '/data/**/*.json', '!src/data/game/**'])
        .pipe(gulp.dest(getBuildPath() + '/assets/data'));
});

gulp.task('data', function(cb) {
    return sequence('gamedata', 'moveData', cb);
});

gulp.task('clean', function() {
    return del([
        getBuildPath()
    ], {
            force: true
        });
});

/*********************************
 * AUDIO *
 ********************************/
gulp.task('audio', function(done) {
    return sequence('sound', 'addLoops', 'moveAudioSprites', done);
});

gulp.task('sound', function() {
    return gulp.src('./src/audio/sound/*.{m4a,mp3,ogg}')
        .pipe(gulp.dest(getBuildPath() + '/assets/audio/sound'));
});

gulp.task('audiosprite', function(done) {
    return sequence('ieAudioSprite', 'modernAudioSprite', done);
});

gulp.task('audiosprites', function(done) {
    return sequence('compileAudioSprites', done);
});

gulp.task('moveAudioSprites', function() {
    return gulp.src('./src/audio/sprite/*.{m4a,mp3,ogg,json}')
        .pipe(gulp.dest(getBuildPath() + '/assets/audio/sprite'));
});

gulp.task('compileAudioSprites', function(done) {
    var options,
        reportOptions;

    options = {
        continueOnError: false, // default = false, true means don't emit error event 
        pipeStdout: false, // default = false, true means stdout is written to file.contents 
        customTemplatingThing: "test" // content passed to gutil.template() 
    };

    reportOptions = {
        err: true, // default = true, false means don't write err 
        stderr: true, // default = true, false means don't write stderr 
        stdout: true // default = true, false means don't write stdout 
    }

    gulp.src('./src/audio')
        .pipe(exec('open ./src/audio/audio_compile.command', options))
        .pipe(exec.reporter(reportOptions));
});

gulp.task('ieAudioSprite', function(done) {
    return process('audiosprite -c 1 -g 2 -r 44100 -e "mp3" -b 128 -o src/audio/sprite/' + argv.s + ' src/audio/sprite/' + argv.s + '/*', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
})

gulp.task('modernAudioSprite', function(done) {
    return process('audiosprite -c 1 -g 2 -r 44100 -e "m4a,ogg" -b 48 -o src/audio/sprite/' + argv.s + ' src/audio/sprite/' + argv.s + '/*', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});

gulp.task('addLoops', function(done) {
    glob.sync(paths.SRC + '/audio/sprite/*.json').forEach(function(fileName) {
        if (argv.s && argv.s !== undefined && fileName.indexOf(argv.s) < 0) {
            return;
        }
        var file = fs.readFileSync(fileName, 'utf8'),
            json = JSON.parse(file),
            spritemap = json.spritemap,
            markers = Object.keys(spritemap);

        _.forEach(markers, function(markerName) {
            if (markerName.indexOf('loop') >= 0) {
                spritemap[markerName].loop = true;
            }
        });

        fs.writeFileSync(fileName, JSON.stringify(json));
    });
    done();
});

gulp.task('delay', function(cb) {
    // (arbitrary) 4 second delay before reloading spritesheets
    // seems to be long enough so the spritesheet is done being written before reloading
    return setTimeout(function() {
        return cb();
    }, 6000);
});

gulp.task('spritereload', function(done) {
    return sequence('delay', 'spritesheets', done);
});

gulp.task('publishSpritesheets', function(done) {
    glob.sync(paths.SRC + '/img/spritesheets/*.tps').forEach(function(fileName) {
        process('TexturePacker ' + fileName + ' --force-publish', function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });

    });
    done();
});

/*********************************
 * WATCH / SERVER (FOR LOCAL DEV) *
 ********************************/
gulp.task('watch', function() {
    gulp.watch(paths.SRC + '/img/spritesheets/output/*.png', ['spritereload'])
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch(paths.SRC + '/img/static/*.{png,jpg}', ['staticimages', browserSync.reload])
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch(paths.LESS + '/**/*.less', ['css', browserSync.reload])
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch('./src/data/**/*.json', ['data', browserSync.reload])
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch(paths.SRC + '/index.html', ['html', browserSync.reload])
        .on('error', gutil.log)
        .on('change', logChanges);

    if (argv.ts) {
        gulp.watch([paths.SCRIPTS + '/**/*.ts', 'submodules/**/*.ts'], ['scripts'])
            .on('error', gutil.log)
            .on('change', logChanges);
    }

    gulp.watch('./static/**/*.js', ['static', browserSync.reload]);

    gulp.watch(paths.DEBUG + '/assets/js/app.js', browserSync.reload);
    gulp.watch(paths.DEBUG + '/assets/img/spritesheets/*.png', browserSync.reload);
    gulp.watch(paths.DEBUG + '/audio/**/*.{m4a,mp3,ogg,json}', browserSync.reload);
});

gulp.task('server', function() {
    return browserSync({
        server: {
            baseDir: [
                paths.DEBUG,
                ''
            ]
        }
    });
});

/*********************************
 * OVERALL ASSETS / STATIC ASSETS *
 ********************************/
gulp.task('static', function() {
    return gulp.src('./static/**')
        .pipe(handleErrors())
        .pipe(gulp.dest(getBuildPath() + '/static'));
});

/*********************************
 * MAIN GULP TASKS *
 ********************************/
gulp.task('compile', function(done) {
    return sequence('clean', 'bump', 'html', 'css', 'data', 'fonts', 'bitmapfonts', 'images', 'audio', isProduction ? 'uglify' : 'scripts', 'static', done);
});

gulp.task('build', function(done) {
    isProduction = true;
    return sequence('compile', done);
});

gulp.task('default', function(done) {
    isProduction = false;
    return sequence('compile', 'watch', 'server', done);
});