import fs from 'fs';
import AWS from 'aws-sdk';
import readPkgUp from 'read-pkg-up';
import { Env } from '@constants/general';

const env = <Env>process.env.APP_ENV || Env.Development;
const sandbox = [Env.Testing].includes(env);
const appPackage = readPkgUp.sync({ normalize: false }).packageJson;

export type Config = {
  readonly env: Env
  readonly sandbox: boolean
  readonly timezone: string

  readonly httpServer: {
    readonly port: number
  }

  readonly databases: {
    readonly dynamoDB: {
      readonly [key: string]: {
        readonly table: string
      }
    }
  }
};

const buildParamName = (param: string): string => {
  return `/${env}/${appPackage.name}${param}`;
};

const PARAMETER_CONFIG = buildParamName('/config');
const PARAMETER_DATABASES = buildParamName('/databases');
const PARAMETER_TIMEZONE = `/${env}/common/timezone`;

const getParameters = async (): Promise<{ [key: string]: string }> => {
  if (env === Env.Development) {
    return {
      [PARAMETER_CONFIG]: fs.readFileSync(`${__dirname}/config.json`).toString(),
      [PARAMETER_DATABASES]: fs.readFileSync(`${__dirname}/databases.json`).toString(),
      [PARAMETER_TIMEZONE]: 'America/Sao_Paulo',
    };
  }

  const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

  const options = {
    Names: [
      PARAMETER_CONFIG,
      PARAMETER_DATABASES,
      PARAMETER_TIMEZONE,
    ],
    WithDecryption: true
  };

  const response = await ssm.getParameters(options).promise();
  let params: { [key: string]: string } = {};

  response.Parameters.forEach((p) => {
    params[p.Name] = p.Value;
  });

  return params;
};

export const getConfig = async (): Promise<Config> => {
  const params = await getParameters();

  const config = JSON.parse(params[PARAMETER_CONFIG]);
  const databases = JSON.parse(params[PARAMETER_DATABASES]);

  config.env = env;
  config.sandbox = sandbox;
  config.timezone = params[PARAMETER_TIMEZONE];
  config.databases = databases;
  config.databases.redis.keyPrefix = `${appPackage.name}:${env}`;

  if (env === Env.Development && config.aws) {
    AWS.config.update(config.aws);
  }

  return config;
};