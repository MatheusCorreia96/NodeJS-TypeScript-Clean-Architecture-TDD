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
  await execPromise(
    'cp src/infra/config/git-ignored/config.json src/infra/config/'
  );
  await execPromise(
    'cp src/infra/config/git-ignored/databases.json src/infra/config/'
  );
  await execPromise('cp src/infra/config/config.json dist/src/infra/config');
  await execPromise('cp src/infra/config/databases.json dist/src/infra/config');
  await execPromise(
    'cp -R src/infra/tools/validators dist/src/infra/tools/validators'
  );
};

const installDependencies = async () => {
  await execPromise('npm install');
};

const clean = async () => {
  await execPromise('rm -rf dist/infra/config/git-ignored');
};

gulp.task(
  'build',
  gulp.series([compile, copyFiles, installDependencies, clean])
);
