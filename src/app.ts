process.env.TZ = 'UTC';
process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED = '1';

import './infra/module-alias';
import 'source-map-support/register';

import { getConfig } from './infra/config/config';
import { AppContainer, setupContainer } from './infra/bootstrap/register';
import { startHttpServer, shutdownHttpServer } from './infra/http/http-server';
import https from 'https';
import fs from 'fs';
import { AwilixContainer } from 'awilix';

if (!process.env.NODE_EXTRA_CA_CERTS) {
  process.env.NODE_EXTRA_CA_CERTS = '/etc/ssl/certs/ca-bundle.crt';
}

if (fs.existsSync(process.env.NODE_EXTRA_CA_CERTS)) {
  https.globalAgent.options.ca = fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS);
}

https.globalAgent.options.keepAlive = true;

let container: AwilixContainer = null;

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

process.on('warning', (warning) => {
  console.log('Warning', { err: warning });
});

process.on('unhandledRejection', (error) => {
  console.log('Unhandled rejection', { err: error });
});

async function init() {
  try {
    const config = await getConfig();

    container = setupContainer(config);

    startHttpServer(config, container);

    console.log('Bootstrapped');
  } catch (err) {
    console.log('Bootstrap error', { err });
    shutdown(1);
  }
}

async function shutdown(exitCode: number) {
  console.log('Shutting down');

  try {
    await shutdownHttpServer();
    console.log('HTTP server closed');
  } catch (err) {
    console.log('HTTP server shutdown error', { err });
  }

  if (container) {
    try {
      await container.dispose();
      console.debug('Container disposed');
    } catch (err) {
      console.error('Error while disposing container', { err });
    }
  }

  console.info('Bye');

  process.exit(exitCode);
}

init();