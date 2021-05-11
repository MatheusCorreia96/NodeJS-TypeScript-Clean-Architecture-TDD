import http from 'http';
import httpShutdown from 'http-shutdown';
import express from 'express';
import bodyParser from 'body-parser';
import { AwilixContainer } from 'awilix';
import { Config } from 'infra/config/config';
import routes from './routes';
import cors from 'cors';

import errorMdw from './middlewares/error';

import { ApplicationError } from 'infra/tools/errors/application';

declare global {
  namespace Express {
    export interface Request {
      id: string
      container: AwilixContainer
      key: {
        account: number
        accountCode: string
        clientId: string
        scopes: string[]
        settings: Object
      }
    }

    export interface Response {
      reqStartedAt: number
    }
  }
}

export class HttpError extends ApplicationError {
  public status?: number;
}

let server: http.Server = null;

export const startHttpServer = (config: Config, container: AwilixContainer): void => {
  if (server) {
    throw new Error('HTTP Server already started');
  }

  let app = express();

  app.disable('x-powered-by');
  app.enable('trust proxy');

  app.route('/healthcheck')
    .get((req, res) => res.status(200).end());

  app.use(cors({ origin: true, credentials: true }));

  app.use(bodyParser.json());

  routes(app);

  app.use(errorMdw);

  server = httpShutdown(http.createServer(app));

  const KEEPALIVE_SECONDS = 65;
  server.keepAliveTimeout = KEEPALIVE_SECONDS * 1000;
  server.headersTimeout = (KEEPALIVE_SECONDS + 5) * 1000;

  server.listen(config.httpServer.port, () => {
    console.log(`HTTP server listening on port ${config.httpServer.port}`);
  });
};

export const shutdownHttpServer = async (): Promise<void> => {
  if (!server) {
    throw new Error('HTTP Server not started');
  }

  const s: any = server;

  return new Promise((resolve, reject) => {
    s.shutdown((err: Error) => {
      server = null;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};