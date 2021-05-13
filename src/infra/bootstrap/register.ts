import { createContainer, asValue, asClass, asFunction, AwilixContainer, InjectionMode, Lifetime } from 'awilix';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
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
import argon2 from 'argon2';
import {v4 as uuidv4 } from 'uuid';

import IncrementAccessCountBs from '@interactors/access-count/increment/increment-access-count.bs';
import GetAccessCountBs from '@interactors/access-count/get/get-access-count.bs';
import CreateUserBs from '@interactors/user/create/create-user.bs';
import GetUserBs from '@interactors/user/get/get-user.bs';

import IncrementAccessCountImpl from '@adapters/gateways/access-count/increment/increment-access-count.impl';
import GetAccessCountImpl from '@adapters/gateways/access-count/get/get-access-count.impl';
import CreateUserImpl from 'adapters/gateways/user/create/create-user.impl';
import GetUserImpl from 'adapters/gateways/user/get/get-user.impl';

const asyncPromise = bluebird.promisifyAll(asyncLib);

export type Argon2 = typeof argon2;
export type AsyncLib = typeof asyncPromise;

export type AppContainer = {
  env: string
  config: Config
  path: typeof path
  ajv: Ajv.Ajv
  ajvLocalize: typeof localize
  fs: typeof fs
  crypto: typeof crypto
  lodash: typeof lodash
  util: typeof util
  asyncLib: AsyncLib
  dynamoDB: AWS.DynamoDB
  axios: AxiosStatic
  forge: typeof forge
  argon2: Argon2
  uuidv4: typeof uuidv4

  requestId: string

  incrementAccessCountBs: IncrementAccessCountBs
  getAccessCountBs: GetAccessCountBs
  createUserBs: CreateUserBs
  getUserBs: GetUserBs
  
  incrementAccessCountImpl: IncrementAccessCountImpl
  getAccessCountImpl: GetAccessCountImpl
  createUserImpl: CreateUserImpl
  getUserImpl: GetUserImpl
}

export const setupContainer = (config: Config): AwilixContainer => {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  container.register({
    env: asValue(config.env),
    config: asValue(config),
    path: asValue(path),
    ajv: asValue(new Ajv({schemaId: 'auto'})),
    ajvLocalize: asValue(localize),
    fs: asValue(fs),
    crypto: asValue(crypto),
    lodash: asValue(lodash),
    util: asValue(util),
    asyncLib: asValue(asyncPromise),
    axios: asValue(axios),
    dynamoDB: asFunction(() => new AWS.DynamoDB()).scoped(),
    forge: asValue(forge),
    argon2: asValue(argon2),
    uuidv4: asValue(uuidv4)
  });

  const baseDir = path.resolve(`${__dirname} + '/../..`);

  container.loadModules([
    `${baseDir}/interactors/**/*.js`,
    `${baseDir}/adapters/gateways/**/*.js`,
    `${baseDir}/adapters/handlers/**/*.js`,
    `${baseDir}/adapters/presenters/**/*.js`,
    `${baseDir}/adapters/repositories/**/*.js`
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