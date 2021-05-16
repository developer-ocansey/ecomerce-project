import * as bodyParser from 'body-parser';

import express, { Application } from 'express';

import { Routes } from './routes/index';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';

require('dotenv').config();
class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(cors());
    require('./middleware/jwt');
  }
}

export default new App().app;
