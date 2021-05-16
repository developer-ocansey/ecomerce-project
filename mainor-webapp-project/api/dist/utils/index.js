"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const Admin_1 = require("../models/Admin");
const AdminToken_1 = require("../models/AdminToken");
const Customer_1 = require("../models/Customer");
const CustomerToken_1 = require("../models/CustomerToken");
const Merchant_1 = require("../models/Merchant");
const MerchantToken_1 = require("../models/MerchantToken");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
class Utils {
    constructor() {
        this.isEmptyObject = (obj) => {
            //Refactor any
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    return false;
                }
            }
            return true;
        };
    }
    readHTMLFile(path, callback) {
        fs_1.default.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    }
    sendEmail(data) {
        // define type for mailOptions
        const template = path_1.default.join(__dirname + '/../' + `/public/${data.templatehtml}`);
        this.readHTMLFile(template, function (err, html) {
            var template = handlebars_1.default.compile(html);
            var replacements = data;
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: `bcdng <${data.from}>`,
                to: data.to,
                subject: data.subject,
                html: htmlToSend
            };
            return new Promise((resolve, reject) => {
                mail_1.default.setApiKey(process.env.SENDGRID_API_KEY || '');
                mail_1.default
                    .send(mailOptions)
                    .then((result) => {
                    console.log(result);
                    return resolve(result);
                })
                    .catch((error) => {
                    return reject(error);
                });
            });
        });
    }
    getUserModel(user) {
        let Model;
        if (user === 'customer') {
            Model = Customer_1.Customer;
        }
        else if (user === 'admin') {
            Model = Admin_1.Admin;
        }
        else {
            Model = Merchant_1.Merchant;
        }
        return Model;
    }
    getUserTokenModel(user) {
        let ModelToken;
        if (user === 'customer') {
            ModelToken = CustomerToken_1.CustomerToken;
        }
        else if (user === 'admin') {
            ModelToken = AdminToken_1.AdminToken;
        }
        else {
            ModelToken = MerchantToken_1.MerchantToken;
        }
        return ModelToken;
    }
    getUserId(user, token) {
        let userId;
        if (user === 'customer') {
            userId = token.customerId;
        }
        else if (user === 'admin') {
            userId = token.adminId;
        }
        else {
            userId = token.merchantId;
        }
        return userId;
    }
    checkUserGroup(res, reqUser) {
        if (['customer', 'admin', 'merchant'].includes(reqUser)) {
            return;
        }
        return res.status(401).json({
            status: false,
            message: 'Invalid user group',
        });
    }
    getUserData(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let usersData;
            if (user === 'customer') {
                usersData = yield Customer_1.Customer.findByPk(id);
            }
            else if (user === 'admin') {
                usersData = yield Admin_1.Admin.findByPk(id);
            }
            else {
                usersData = yield Merchant_1.Merchant.findByPk(id);
            }
            return usersData;
        });
    }
    formatResponse(res, status = false, message = 'Error', data = {}) {
        res.json({
            status: status,
            message: message,
            data: data,
        });
    }
}
exports.Utils = Utils;
