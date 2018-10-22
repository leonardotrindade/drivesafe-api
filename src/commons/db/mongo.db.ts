'use strict';

import logger from '../../commons/logger/logger';
import * as Promise from 'bluebird';
import * as mongoose from 'mongoose';
(<any>mongoose).Promise = Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

export default class MongoDB {
  private addListeners() {
    mongoose.connection.once('open', () => {
      logger.info('MongoDB connected');
      mongoose.connection.on('disconnected',
        () => logger.info('MongoDB disconnected'));

      mongoose.connection.on('reconnected',
        () => logger.info('MongoDB event reconnected'));

      mongoose.connection.on('error',
        err => logger.info('MongoDB event error: ', err));
    });
  }

  public async connect() {
    this.addListeners();
    await mongoose.connect(process.env.MONGO_CONN_STR, {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
    });
  }

  public disconnect() {
    return mongoose.disconnect();
  }
}
