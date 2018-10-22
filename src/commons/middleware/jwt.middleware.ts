'use strict';

import { Request, Response, NextFunction } from 'express';
import HttpController from '../controllers/http.controller';
import HttpError from '../utils/http.error';
import { Message, StatusCode } from '../enums/http.enum';
import JwtUtils from '../utils/jwt.utils';

class JwtMiddleware extends HttpController {
  constructor() {
    super();
    this.process = this.process.bind(this);
  }

  _getTokenFromHeader(req: Request) {
    const { authorization } = req.headers;
    return authorization ? authorization.split(/(\s+)/)[2] : '';
  }

  async process(req: any, res: Response, next: NextFunction) {
    const { originalUrl } = req;
    let token;

    try {
      if (originalUrl === '/api/user' || originalUrl === '/api/user/login') {
        next();
      } else {
        token = this._getTokenFromHeader(req);
        req.token = await JwtUtils.verify(token);
        next();
      }
    } catch (err) {
      next(new HttpError(Message.TOKEN_EXPIRED, StatusCode.BAD_REQUEST, { token, error: err.message }));
    }
  }

  initialize() {
    return this.process;
  }
}

export default new JwtMiddleware();
