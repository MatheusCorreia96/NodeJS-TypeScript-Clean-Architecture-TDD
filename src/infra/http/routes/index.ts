import { Application } from 'express';

import accessCount from './access-count';
import user from './user';

export default (app: Application) => {
  accessCount(app);
  user(app);

  app.use(function (req, res) {
    res.status(404).json({
      nome: 'not_found',
      mensagem: 'Not found https'
    });
  });
};