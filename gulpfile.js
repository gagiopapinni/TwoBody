const path = require("path");
const gulp = require("gulp");
const webpack = require("webpack-stream");

let source_map = true;

let bundle =  function () {
  return gulp.src(["src/js/index.js"])
    .pipe(webpack({
         entry: "./src/js/index.js", 
         output: {
             filename: "bundle.js"
         },
         devtool: source_map?"source-map":false
     }))
    .pipe(gulp.dest("./build"));
};

gulp.task("default",bundle);


