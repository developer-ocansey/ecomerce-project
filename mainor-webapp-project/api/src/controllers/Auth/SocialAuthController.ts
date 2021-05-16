import { Request, Response } from 'express';
import passport from 'passport';
import strategy from 'passport-facebook';

import { Utils } from '../../utils/index';

const utils = new Utils();
const FacebookStrategy = strategy.Strategy;

export class SocialAuthController {
  constructor() {}
  FBCallback() {
    throw new Error('Method not implemented.');
  }
  FBAuthenticate() {
    throw new Error('Method not implemented.');
  }
  GoogleCallback() {
    throw new Error('Method not implemented.');
  }
  GoogleAuthenticate() {
    throw new Error('Method not implemented.');
  }
}
