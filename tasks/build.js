const gulp = require('gulp');
const bluebird = require('bluebird');
const exec = require('child_process').exec;
const execPromise = bluebird.Promise.promisify(exec);

const compile = async () => {
  return execPromise('tsc');
};

const copyFiles = async () => {
  await execPromise('cp package.json dist/');
  await execPromise('cp package-lock.json dist/');
};

const installDependencies = async () => {
  await execPromise('npm install --production --prefix dist');
};

const clean = async () => {
  await execPromise('rm -rf dist/infra/config/git-ignored');
};

gulp.task('build', gulp.series([
  compile,
  copyFiles,
  installDependencies,
  clean,
]));