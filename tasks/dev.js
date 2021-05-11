const gulp = require('gulp');
const childProcess = require('child_process');
const argv = require('yargs').argv;
const fs = require('fs');
const eslint = require('gulp-eslint');

let nodeApp;

process.on('SIGINT', () => {
  nodeApp.kill('SIGINT');
});

const startNodeServer = () => {
  if (!fs.existsSync('dist/app.js')) {
    return;
  }

  gulp.series('eslint')();

  if (nodeApp) {
    nodeApp.kill('SIGINT');
  }

  let params = ['dist/app.js'];

  if (process.env.DEBUG || argv.debug) {
    params.unshift('--inspect=0.0.0.0:9229');
  }

  nodeApp = childProcess.spawn('node', params, {
    env: Object.assign({
      AWS_SDK_LOAD_CONFIG: 1,
      AWS_REGION: 'us-east-1',
    }, process.env)
  });

  nodeApp.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  nodeApp.stderr.on('data', (data) => {
    console.error(data.toString());
  });

};

const tsWatch = (done) => {
  const ts = childProcess.spawn('tsc', ['-w -p src', '--skipLibCheck']);

  ts.stdout.on('data', (data) => {
    console.log(data.toString());
    if (data.toString().includes('Found')) {
      startNodeServer();
    }
  });

  process.on('SIGINT', () => {
    done();
  });
};

gulp.task('eslint', function () {
  return gulp.src(['*/.ts', '*/.js', '!node_modules/*', '!dist/*'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('default', gulp.series([
  tsWatch
]));