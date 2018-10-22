'use strict';

import BaseRouter from '../../../commons/router/base.router';
import AlertController from './controller/alert.controller';
import AlertValidator from './validator/alert.validator';

class AlertRouter extends BaseRouter {
  constructor() {
    super();
    this.controller = AlertController;
  }

  initialize() {
    this.post('/', AlertController.sendAlert, AlertValidator.sendAlert);
  }
}

export default new AlertRouter().getRouter();
