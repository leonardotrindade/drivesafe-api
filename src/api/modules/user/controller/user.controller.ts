'use strict';

import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import HttpController from '../../../../commons/controllers/http.controller';
import { Message, StatusCode } from '../../../../commons/enums/http.enum';
import HttpError from '../../../../commons/utils/http.error';
import JwtUtils from '../../../../commons/utils/jwt.utils';
import User from '../../../../models/user.model';

class UserController extends HttpController {
  private hash(data: string) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(data, null, null, (err, result) => {
        if (err) {
          reject(typeof (err) === 'string' ? new Error(err) : err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private compare(data: string, encrypted: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data, encrypted, (err, result) => {
        if (err) {
          reject(typeof (err) === 'string' ? new Error(err) : err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async createUser(req: Request, res: Response) {
    const { user, password } = req.body;
    const userStored = await User.findOne({ user }).lean();
    if (userStored) {
      throw new HttpError(Message.USER_ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }
    await new User({ user, password: await this.hash(password) }).save();
    res.sendStatus(201);
  }

  public async login(req: Request, res: Response) {
    const { user, password } = req.body;
    if (!user || !password) {
      throw new HttpError(Message.INVALID_REQUEST, StatusCode.BAD_REQUEST);
    }

    const userStored = await User.findOne({ user }).lean();
    if (!userStored) {
      throw new HttpError(Message.USER_LOGIN_ERROR, StatusCode.BAD_REQUEST);
    }

    const passMatch = await this.compare(password, userStored.password);
    if (!passMatch) {
      throw new HttpError(Message.USER_LOGIN_ERROR, StatusCode.BAD_REQUEST);
    }

    const token = JwtUtils.sign({ user });
    res.json({ token });
  }

  public async updateToken(req: any, res: Response) {
    const { body, token } = req;
    const userStored = await User.findOne({ user: token.user });
    if (!userStored) {
      throw new HttpError(Message.USER_NOT_FOUND, StatusCode.BAD_REQUEST);
    }
    userStored.firebaseToken = body.token;
    await userStored.save();
    res.sendStatus(200);
  }
}

export default new UserController();
