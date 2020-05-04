const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass");


function compileXCloudGridProjectSass(cb) {
    src("projects/xcloud-grid/src/resources/**/*.scss").pipe(sass())
        .on('error', cb)
        .pipe(dest("dist/xcloud-grid/resources")).on('end', cb);
}//compileSass


exports.compileXCloudGridProjectSass = series(compileXCloudGridProjectSass);

