"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_jwt_2 = __importDefault(require("passport-jwt"));
const Customer_1 = require("../models/Customer");
const Admin_1 = require("../models/Admin");
const Merchant_1 = require("../models/Merchant");
const JwtStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_2.default.ExtractJwt;
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: process.env.JWT_SECRET || 'default103',
};
passport_1.default.use(new JwtStrategy(opts, (jwt_payload, done) => {
    let User;
    if (jwt_payload.userType === 'customer') {
        User = Customer_1.Customer;
    }
    else if (jwt_payload.userType === 'merchant') {
        User = Merchant_1.Merchant;
    }
    else if (jwt_payload.userType === 'admin') {
        User = Admin_1.Admin;
    }
    else {
        return done(false, { message: 'Server Error' });
    } // TODO Refactor this block of code... use switch case
    User.findByPk(jwt_payload.id)
        .then((user) => {
        if (user) {
            user.userType = jwt_payload.userType;
            return done(null, user);
        }
        return done(null, false);
    })
        .catch((err) => {
        return done(err, false, { message: 'Server Error' });
    });
}));
