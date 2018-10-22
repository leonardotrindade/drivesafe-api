'use strict';

import { Application} from 'express';
import AlertRouter from './modules/alert/alert.router';
import UserRouter from './modules/user/user.router';

export default (app: Application) => {
  app.use('/api/alert', AlertRouter);
  app.use('/api/user', UserRouter);
};
