'use strict';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as cors from 'cors';
import * as morgan from 'morgan';
import logger from './commons/logger/logger';
import routes from './api/routes';
import HttpError from './commons/utils/http.error';
import { Message, StatusCode } from './commons/enums/http.enum';
import MongoDB from './commons/db/mongo.db';
import JwtMiddleware from './commons/middleware/jwt.middleware';

class HttpServer {
  private app: express.Application;
  private server: http.Server;
  private port: number;
  private mongo: MongoDB;

  /**
   * Startup the HttpServer.
   */
  public static async startUp() {
    try {
      const { mongo, server, port } = new HttpServer();
      await mongo.connect();
      server.listen(port);
    } catch (err) {
      logger.error(err);
    }
  }

  private constructor() {
    this.app = express();
    this.mongo = new MongoDB();

    this.expressConfiguration();

    this.port = Number(process.env.PORT || '3000');
    this.server = http.createServer(this.app);

    this.server.on('error', this.onError.bind(this));
    this.server.on('listening', this.onListening.bind(this));
  }

  private expressConfiguration() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // cors settings
    this.app.use(cors());

    // morgan settings
    this.app.use(morgan(':method :url :status :response-time'));
    this.app.use(JwtMiddleware.initialize());

    // load api modules routes
    routes(this.app);

    // catch 404 and set error handler
    this.app.use('*', this.routeHandler, this.errorHandler);
  }

  private routeHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!res.headersSent) {
      return next(new HttpError(Message.ROUTE_NOT_FOUND, StatusCode.NOT_FOUND));
    }
    next();
  }

  private errorHandler(err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.error(err.stack);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.statusCode || 500).json({
      message: err.message,
      errors: err.errors,
      data: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
  }

  /**
   * Event listener for HTTP server 'listening' event.
   */
  private onListening() {
    logger.info(`Server listening on port: ${this.port}`);
  }

  /**
   * Event listener for HTTP server 'error' event.
   */
  private onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(`Port ${this.port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`Port ${this.port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}

HttpServer.startUp();
