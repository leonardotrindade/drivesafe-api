'use strict';

import BaseRouter from '../../../commons/router/base.router';
import UserController from './controller/user.controller';
import UserValidator from './validator/user.validator';

class UserRouter extends BaseRouter {
  constructor() {
    super();
    this.controller = UserController;
  }

  initialize() {
    this.post('/', UserController.createUser, UserValidator.createUser);
    this.post('/login', UserController.login, UserValidator.createUser);
    this.post('/token', UserController.updateToken, UserValidator.updateToken);
  }
}

export default new UserRouter().getRouter();
