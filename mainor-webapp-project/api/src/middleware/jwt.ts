import passport from 'passport';
import jwtstrategy from 'passport-jwt';
import extractjwt from 'passport-jwt';

import { Customer } from '../models/Customer';
import { Admin } from '../models/Admin';
import { Merchant } from '../models/Merchant';

const JwtStrategy = jwtstrategy.Strategy;
const ExtractJwt = extractjwt.ExtractJwt;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: process.env.JWT_SECRET || 'default103',
};

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    let User: any;
    if (jwt_payload.userType === 'customer') {
      User = Customer;
    } else if (jwt_payload.userType === 'merchant') {
      User = Merchant;
    } else if (jwt_payload.userType === 'admin') {
      User = Admin;
    } else {
      return done(false, { message: 'Server Error' });
    }// TODO Refactor this block of code... use switch case
    User.findByPk(jwt_payload.id)
      .then((user: any) => {
        if (user) { 
          user.userType = jwt_payload.userType
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err: any) => {
        return done(err, false, { message: 'Server Error' });
      });
  }),
);
