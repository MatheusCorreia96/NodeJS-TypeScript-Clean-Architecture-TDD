const gulp = require('gulp');
const bluebird = require('bluebird');
const exec = require('child_process').exec;
const execPromise = bluebird.Promise.promisify(exec);
const fs = require('fs');
const AWS = require('aws-sdk');
const lodash = require('lodash');

const readJSON = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path).toString());
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    }

    const fileErr = new Error(`Error while reading "${path}": ${err.message}`);
    fileErr.stack = `Error while reading "${path}": ${err.stack}`;
    throw fileErr;
  }
};

const mergeJSON = async (srcPath, destPath) => {
  const obj1 = readJSON(srcPath);
  const obj2 = readJSON(destPath);
  const mergedObj = lodash.merge(obj1, obj2);

  fs.writeFileSync(destPath, JSON.stringify(mergedObj, null, 2));
};

const copyConfig = async () => {
  mergeJSON('src/infra/config/git-ignored/config.json', 'src/infra/config/config.json');
  mergeJSON('src/infra/config/git-ignored/databases.json', 'src/infra/config/databases.json');
};

const compile = async () => {
  await execPromise('tsc');
};

const getConfig = () => {
  const config = require('../src/infra/config/config.json');
  config.databases = require('../src/infra/config/databases.json');
  AWS.config.update(config.aws);
  return config;
};

const createDynamoDBTables = async () => {
  const config = getConfig();
  const dynamoDB = new AWS.DynamoDB();

  const createTable = async (tableConfig) => {
    try {
      await dynamoDB.createTable(tableConfig).promise();
    } catch (err) {
      const ignoredErrors = [
        'Table already created',
        'Cannot create preexisting table'
      ];

      if (!ignoredErrors.includes(err.message)) {
        throw err;
      }
    }
  };


  await createTable({
    TableName: config.databases.dynamoDB.Users.table,
    AttributeDefinitions: [
      {
        AttributeName: 'email',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'email',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  });
};

gulp.task('setup', gulp.series([
  copyConfig,
  compile,
  createDynamoDBTables
]));