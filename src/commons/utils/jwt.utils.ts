'use strict';

import * as jwt from 'jsonwebtoken';
import * as Promise from 'bluebird';

class JwtUtils {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET;
  }

  async verify(token: string) {
    const jwtVerifyAsync = Promise.promisify(jwt.verify);
    return jwtVerifyAsync(token, this.secret);
  }

  sign(payload: object) {
    return jwt.sign(payload, this.secret);
  }
}

export default new JwtUtils();
