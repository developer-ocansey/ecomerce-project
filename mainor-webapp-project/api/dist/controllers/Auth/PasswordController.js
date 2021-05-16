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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordController = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../../utils/index");
const utils = new index_1.Utils();
class PasswordController {
    recover(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqUser = req.params.user;
            utils.checkUserGroup(res, reqUser);
            try {
                const { email } = req.body;
                let userModel = utils.getUserModel(reqUser);
                const user = yield userModel.findOne({
                    where: { email: email },
                });
                if (!user)
                    return res.status(401).json({
                        message: 'The email address ' +
                            req.body.email +
                            ' is not associated with any account. Double-check your email address and try again.',
                    });
                //Generate and set password reset token
                user.generatePasswordReset(user);
                // Save the updated user object
                yield user.save();
                // send email
                const Maildata = {};
                Maildata['subject'] = 'Password change request';
                Maildata['to'] = user.email;
                Maildata['from'] = process.env.FROM_EMAIL;
                Maildata['token'] = user.resetPasswordToken;
                Maildata['firstName'] = user.firstName;
                Maildata['templatehtml'] = "verifyToken.html";
                utils.sendEmail(Maildata);
                res.status(200).json({
                    message: 'A reset email has been sent to ' + user.email + '.',
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    reset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqUser = req.params.user;
            utils.checkUserGroup(res, reqUser);
            try {
                const { token } = req.params;
                let userModel = utils.getUserModel(reqUser);
                const user = yield userModel.findOne({
                    where: {
                        resetPasswordToken: token,
                        resetPasswordExpires: { $gt: Date.now() },
                    },
                });
                if (!user)
                    return res.status(401).json({
                        message: 'Password reset token is invalid or has expired.',
                    });
                //Redirect user to form with the email address
                res.render('reset', { user });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqUser = req.params.user;
            utils.checkUserGroup(res, reqUser);
            try {
                const { token } = req.params;
                let userModel = utils.getUserModel(reqUser);
                const user = yield userModel.findOne({
                    where: {
                        resetPasswordToken: token,
                        resetPasswordExpires: {
                            [sequelize_1.Op.gt]: Date.now(),
                        },
                    },
                });
                if (!user)
                    return res.status(401).json({
                        message: 'Password reset token is invalid or has expired.',
                    });
                // Set the new password
                user.password = req.body.password;
                user.resetPasswordToken = '';
                user.resetPasswordExpires = 0;
                user.isVerified = true;
                // Save the updated user object
                yield user.save();
                let subject = 'Your password has been changed';
                let to = user.email;
                let from = process.env.FROM_EMAIL;
                let html = `<p>Hi ${user.firstName}</p>
                  <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`;
                yield utils.sendEmail({ to, from, subject, html });
                res.status(200).json({ message: 'Your password has been updated.' });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            if (!newPassword || !oldPassword) {
                res.json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                try {
                    const reqUser = req.params.user;
                    let userModel = utils.getUserModel(reqUser);
                    const user = yield userModel.findOne({
                        where: {
                            id: userId,
                        },
                    });
                    if (!user)
                        return res.json({
                            status: false,
                            message: 'User does not Exist',
                        });
                    if (!user.comparePassword(oldPassword))
                        return res.json({ status: false, message: 'Old Password does not match' });
                    user.password = newPassword;
                    yield user.save();
                    res.json({
                        status: true,
                        message: 'Password Changed Successfully',
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    }
    testMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users, email } = req.params;
            console.log(email, email);
            let userModel = utils.getUserModel(users);
            const user = yield userModel.findOne({
                where: { email },
            });
            const token = user.generateVerificationToken();
            // Save the verification token
            yield token.save();
            const Maildata = {};
            Maildata['subject'] = 'Account Verification Token';
            Maildata['to'] = user.email;
            Maildata['from'] = process.env.FROM_EMAIL;
            Maildata['token'] = token.token;
            Maildata['firstName'] = user.firstName;
            Maildata['templatehtml'] = "verifyToken.html";
            yield utils.sendEmail(Maildata);
            console.log(Maildata);
            return res.status(200).json({ status: "successful" });
        });
    }
}
exports.PasswordController = PasswordController;
