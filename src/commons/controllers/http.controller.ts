'use strict';

import { Response, NextFunction } from 'express';
import { Message } from '../enums/http.enum';

export default abstract class HttpController {
  protected sendResponse(res: Response, next?: NextFunction, data?: any, message?: Message) {
    res.status(200).json({
      message: message || '',
      data: data
    });
    if (next) {
      next();
    }
  }
}
