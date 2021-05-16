"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthController = void 0;
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const index_1 = require("../../utils/index");
const utils = new index_1.Utils();
const FacebookStrategy = passport_facebook_1.default.Strategy;
class SocialAuthController {
    constructor() { }
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
exports.SocialAuthController = SocialAuthController;
