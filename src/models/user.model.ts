'use strict';

import { Document, Schema, model } from 'mongoose';

interface IUserDocument extends Document {
  user: string;
  password: string;
  plate: string;
  firebaseToken: string;
  alerts: Array<object>;
}

const alertSchema = new Schema({
  timestamp: { type: Date, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true }
});

const userSchema = new Schema({
  user: { type: String, required: true },
  password: { type: String, required: true },
  plate: String,
  firebaseToken: String,
  alerts: [alertSchema]
});

export default model<IUserDocument>('user', userSchema);
