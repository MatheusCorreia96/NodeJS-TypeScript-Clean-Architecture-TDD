import { createContainer, asValue, asClass, asFunction, AwilixContainer, InjectionMode, Lifetime } from 'awilix';
import fs from 'fs';
import crypto from 'crypto';
import lodash from 'lodash';
import path from 'path';
import util from 'util';
import asyncLib from 'async';
import bluebird from 'bluebird';
import { Config } from 'infra/config/config';
import AWS from 'aws-sdk';
import axios, { AxiosStatic } from 'axios';
import forge from 'node-forge';

const asyncPromise = bluebird.promisifyAll(asyncLib);

export type AsyncLib = typeof asyncPromise;

export type AppContainer = {
  env: string
  config: Config
  path: typeof path
  fs: typeof fs
  crypto: typeof crypto
  lodash: typeof lodash
  util: typeof util
  asyncLib: AsyncLib
  dynamoDB: AWS.DynamoDB
  axios: AxiosStatic
  forge: typeof forge

  requestId: string
}

export const setupContainer = (config: Config): AwilixContainer => {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  container.register({
    env: asValue(config.env),
    config: asValue(config),
    path: asValue(path),
    fs: asValue(fs),
    crypto: asValue(crypto),
    lodash: asValue(lodash),
    util: asValue(util),
    asyncLib: asValue(asyncPromise),
    axios: asValue(axios),
    dynamoDB: asFunction(() => new AWS.DynamoDB()).scoped(),
    forge: asValue(forge),

  });

  const baseDir = path.resolve(`${__dirname} + '/../..`);

  container.loadModules([
    `${baseDir}/interactors/*/.js`,
    `${baseDir}/adapters/gateways/*/.js`,
    `${baseDir}/adapters/handlers/*/.js`,
    `${baseDir}/adapters/presenters/*/.js`,
    `${baseDir}/adapters/repositories/*/.js`
  ], {
    formatName: (name: string) => {
      name = lodash.camelCase(name);
      return name;
    },
    resolverOptions: {
      register: asClass,
      lifetime: Lifetime.SCOPED
    }
  });

  return container;
};