'use strict';

import { checkSchema } from 'express-validator/check';

export default abstract class UserValidator {
  public static createUser = checkSchema({
    user: {
      in: ['body'],
      errorMessage: 'user is invalid',
      isString: true
    },
    password: {
      in: ['body'],
      errorMessage: 'password is invalid',
      isString: true
    }
  });

  public static updateToken = checkSchema({
    token: {
      in: ['body'],
      errorMessage: 'token is invalid',
      isString: true
    }
  });
}
