import { validationResult } from 'express-validator';

class Validate {
  public errors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = {};
      errors.array().map((err) => (error[err.param] = err.msg));
      return res.status(422).json({ error });
    }

    next();
  }
}

export const { errors } = new Validate();
