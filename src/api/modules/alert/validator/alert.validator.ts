'use strict';

import { checkSchema } from 'express-validator/check';

export default abstract class AlertValidator {
  public static sendAlert = checkSchema({
    lat: {
      in: ['body'],
      errorMessage: 'lat is invalid',
      isNumeric: true
    },
    long: {
      in: ['body'],
      errorMessage: 'long is invalid',
      isNumeric: true
    }
  });
}
