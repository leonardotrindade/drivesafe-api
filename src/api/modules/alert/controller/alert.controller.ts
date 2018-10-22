'use strict';

import { Response } from 'express';
import * as admin from 'firebase-admin';
import HttpController from '../../../../commons/controllers/http.controller';
import { Message, StatusCode } from '../../../../commons/enums/http.enum';
import HttpError from '../../../../commons/utils/http.error';
import User from '../../../../models/user.model';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ID,
    clientEmail: process.env.FIREBASE_EMAIL,
    privateKey: process.env.FIREBASE_KEY
  })
});

class AlertController extends HttpController {
  public async sendAlert(req: any, res: Response) {
    const { body, token } = req;
    const userStored = await User.findOne({ user: token.user });
    if (!userStored) {
      throw new HttpError(Message.USER_NOT_FOUND, StatusCode.BAD_REQUEST);
    }
    body.timestamp = Date.now();
    userStored.alerts.push(body);
    await userStored.save();
    await admin.messaging().send({
      notification: {
        title: 'Cuidado!',
        body: 'Você está dirigindo sonolento, cuidado!'
      },
      token: userStored.firebaseToken
    });
    res.sendStatus(200);
  }
}

export default new AlertController();
