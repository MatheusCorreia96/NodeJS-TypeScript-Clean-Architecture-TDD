import { Application } from 'express';
import accessCountCtrl from '@adapters/controllers/access-count.ctrl';

export default (app: Application) => {
  app.route('/accesscount')
    .post(
      accessCountCtrl.increment
    )
}