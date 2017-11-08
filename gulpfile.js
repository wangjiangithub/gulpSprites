var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');
var tiny = require('gulp-tinypng-nokey');
var gm = require('gulp-gm');
var rename = require("gulp-rename");
var clean = require('gulp-clean');

gulp.task('generateEvenRetina', function() {
    var evener = gm(function(gmfile, done) {
        gmfile.size(function(error, size) {
            done(null,
                gmfile.background('transparent')
                .extent(size.width + (size.width % 2), size.height + (size.height % 2))
            );
        });
    });
    return gulp.src('images/*.png')
        .pipe(evener)
        .pipe(rename(function(path){
            path.basename += '@2x'
        }))
        .pipe(gulp.dest('generate'));
});

gulp.task('downsizeRetinaSprites', ['generateEvenRetina'], function downsizeRetinaSprites() {
    return gulp.src('generate/*@2x.png')
        .pipe(imageResize({ width: '50%', height: '50%' }))
        .pipe(rename(function(path){
            path.basename = path.basename.slice(0,-3)
        }))
        .pipe(gulp.dest('generate'));
});

gulp.task('generateSprite', ['downsizeRetinaSprites'], function() {
    var spriteData = gulp.src(['generate/*.png']).pipe(spritesmith({
        retinaSrcFilter: 'generate/*@2x.png',
        imgName: 'spritesheet.png',
        retinaImgName: 'spritesheet@2x.png',
        cssName: 'sprites.scss',
        cssFormat: 'scss',
        cssTemplate: 'scss.template.handlebars'
    }));
    return spriteData.pipe(gulp.dest('./output/'));
});

gulp.task('clean',['generateSprite'], function () {
  return gulp.src('generate', {read: false})
    .pipe(clean());
});

gulp.task('sprite',['clean'],function(){
    console.log('success','hey dude, sprite well done !');
})





// 输出裁剪50%的图
// gulp.task('downsize-retina-sprites', function downsizeRetinaSprites () {
//   return gulp.src('images/2x/*.png')
//     .pipe(imageResize({width: '50%', height: '50%'}))
//     .pipe(gulp.dest('images/1x/'));
// });