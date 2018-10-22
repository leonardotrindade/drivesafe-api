'use strict';

import { Message, StatusCode } from '../enums/http.enum';

export default class HttpError extends Error {
  constructor(message: Message, public statusCode: StatusCode, public errors?: any) {
    super(message);
  }
}
