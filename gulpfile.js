const gulp = require("gulp");
const { exec } = require('child_process');

let HELPERS = {
    execute: (command) => {
        const process = exec(command);
        process.stdout.on('data', (data) => { console.log(data.toString()); })
        process.stderr.on('data', (data) => { console.log(data.toString()); })
        process.on('exit', (code) => {
            console.log('Process exited with code ' + code.toString());
        })
        return process;
    }
}

gulp.task("ts", function () {
    return HELPERS.execute('rollup -c');
});

gulp.task("default", gulp.series("ts", function () {
    gulp.watch(
        "./src/**/*.ts",
        { ignoreInitial: false, usePolling: true },
        gulp.series("ts")
    );
}));