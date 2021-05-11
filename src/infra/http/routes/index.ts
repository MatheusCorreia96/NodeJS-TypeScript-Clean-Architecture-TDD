import { Application } from 'express';

import accessCount from './access-count';

export default (app: Application) => {
  accessCount(app);

  app.use(function (req, res) {
    res.status(404).json({
      nome: 'not_found',
      mensagem: 'Not found https'
    });
  });
};