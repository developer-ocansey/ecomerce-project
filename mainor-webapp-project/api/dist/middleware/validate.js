"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
const express_validator_1 = require("express-validator");
class Validate {
    errors(req, res, next) {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            let error = {};
            errors.array().map((err) => (error[err.param] = err.msg));
            return res.status(422).json({ error });
        }
        next();
    }
}
exports.errors = new Validate().errors;
