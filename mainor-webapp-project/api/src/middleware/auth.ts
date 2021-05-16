import passport, { use } from 'passport';

class Auth {
  public customerAccess(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      // console.log(user.userType);
      if (err) return next(err);
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
  public merchantAccess(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      // console.log(user);
      if (err) return next(err);
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
  public adminAccess(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      // console.log(user);
      if (err) return next(err);
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

  public merchantAdminAccess(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      // console.log(user);
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid Token Provided!',
        });
      }
      if (user.userType == 'admin' || user.userType == 'merchant') {
        req.user = user;
        next();
      } else {
        return res.json({
          message: 'Unauthorized Access',
          //user: user.userType,
        });
      }
    })(req, res, next);
  }

  public customerAdminAccess(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      // console.log(user);
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid Token Provided!',
        });
      }
      if (user.userType == 'admin' || user.userType == 'customer') {
        req.user = user;
        next();
      } else {
        return res.json({
          message: 'Unauthorized Access',
          //user: user.userType,
        });
      }
    })(req, res, next);
  }

  public allAccess(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      // console.log(user);
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid Token Provided!',
        });
      }
      if (user.userType == 'customer' || user.userType == 'admin' || user.userType == 'merchant') {
        req.user = user;
        next();
      } else {
        return res.json({
          message: 'Unauthorized Access',
          //user: user.userType,
        });
      }
    })(req, res, next);
  }
}

export const {
  customerAccess,
  merchantAccess,
  adminAccess,
  allAccess,
  merchantAdminAccess,
  customerAdminAccess,
} = new Auth();
