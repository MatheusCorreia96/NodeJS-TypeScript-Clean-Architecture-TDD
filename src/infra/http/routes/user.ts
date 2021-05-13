import { Application } from 'express';
import userCtrl from '@adapters/controllers/user.ctrl';
import validateSchema from '../middlewares/validate-schema';

export default (app: Application) => {
  app.route('/user')
    .post(
      validateSchema('user/create'),
      userCtrl.create
    )
    .get(
      validateSchema('user/get'),
      userCtrl.get
    )
}