import { Application } from 'express';
import userCtrl from '@adapters/controllers/user.ctrl';

export default (app: Application) => {
  app.route('/user')
    .post(
      userCtrl.create
    )
}