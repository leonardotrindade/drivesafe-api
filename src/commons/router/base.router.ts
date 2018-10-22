'use strict';

import { RequestHandler, Router, Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator/check';
import asyncMiddleware from '../middleware/async.middleware';
import HttpController from '../controllers/http.controller';
import HttpError from '../utils/http.error';
import { Message, StatusCode } from '../enums/http.enum';

export default abstract class BaseRouter {
  private router: Router;
  protected controller: HttpController;

  constructor() {
    this.router = Router({ mergeParams: true });
  }

  private checkValidationHandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty() && !res.headersSent) {
      return next(new HttpError(Message.INVALID_REQUEST, StatusCode.BAD_REQUEST, errors.mapped()));
    }
    next();
  }

  protected post(path: string, fn: Function, validator: ValidationChain[], ...middlewares: RequestHandler[]) {
    this.router.post(path, validator, this.checkValidationHandler, middlewares, asyncMiddleware(fn.bind(this.controller)));
  }

  protected get(path: string, fn: Function, validator: ValidationChain[], ...middlewares: RequestHandler[]) {
    this.router.get(path, validator, this.checkValidationHandler, middlewares, asyncMiddleware(fn.bind(this.controller)));
  }

  protected put(path: string, fn: Function, validator: ValidationChain[], ...middlewares: RequestHandler[]) {
    this.router.put(path, validator, this.checkValidationHandler, middlewares, asyncMiddleware(fn.bind(this.controller)));
  }

  protected delete(path: string, fn: Function, validator: ValidationChain[], ...middlewares: RequestHandler[]) {
    this.router.delete(path, validator, this.checkValidationHandler, middlewares, asyncMiddleware(fn.bind(this.controller)));
  }

  protected initialize() { } // tslint:disable-line

  public getRouter(): Router {
    this.initialize();
    return this.router;
  }
}
