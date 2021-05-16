"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerAdminAccess = exports.merchantAdminAccess = exports.allAccess = exports.adminAccess = exports.merchantAccess = exports.customerAccess = void 0;
const passport_1 = __importDefault(require("passport"));
class Auth {
    customerAccess(req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user) {
            // console.log(user.userType);
            if (err)
                return next(err);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid Token Provided!',
                });
            }
            if (user.userType != 'customer') {
                return res.status(401).json({
                    message: 'Unauthorized Access',
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
    merchantAccess(req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user) {
            // console.log(user);
            if (err)
                return next(err);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid Token Provided!',
                });
            }
            if (user.userType != 'merchant') {
                return res.status(401).json({
                    message: 'Unauthorized Access',
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
    adminAccess(req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user) {
            // console.log(user);
            if (err)
                return next(err);
            if (!user && user.userType != 'customer') {
                return res.status(401).json({
                    message: 'Invalid Token Provided!',
                });
            }
            if (user.userType != 'admin') {
                return res.status(401).json({
                    message: 'Unauthorized Access',
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
    merchantAdminAccess(req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user) {
            // console.log(user);
            if (err)
                return next(err);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid Token Provided!',
                });
            }
            if (user.userType == 'admin' || user.userType == 'merchant') {
                req.user = user;
                next();
            }
            else {
                return res.json({
                    message: 'Unauthorized Access',
                });
            }
        })(req, res, next);
    }
    customerAdminAccess(req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user) {
            // console.log(user);
            if (err)
                return next(err);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid Token Provided!',
                });
            }
            if (user.userType == 'admin' || user.userType == 'customer') {
                req.user = user;
                next();
            }
            else {
                return res.json({
                    message: 'Unauthorized Access',
                });
            }
        })(req, res, next);
    }
    allAccess(req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user) {
            // console.log(user);
            if (err)
                return next(err);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid Token Provided!',
                });
            }
            if (user.userType == 'customer' || user.userType == 'admin' || user.userType == 'merchant') {
                req.user = user;
                next();
            }
            else {
                return res.json({
                    message: 'Unauthorized Access',
                });
            }
        })(req, res, next);
    }
}
_a = new Auth(), exports.customerAccess = _a.customerAccess, exports.merchantAccess = _a.merchantAccess, exports.adminAccess = _a.adminAccess, exports.allAccess = _a.allAccess, exports.merchantAdminAccess = _a.merchantAdminAccess, exports.customerAdminAccess = _a.customerAdminAccess;
