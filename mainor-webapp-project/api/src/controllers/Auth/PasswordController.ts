import { Request, Response } from 'express';

import { Op } from 'sequelize';
import { Utils } from '../../utils/index';

const utils = new Utils();
export class PasswordController {
  async recover(req: Request, res: Response) {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
      const { email } = req.body;
      let userModel = utils.getUserModel(reqUser);
      const user = await userModel.findOne({
        where: { email: email },
      });

      if (!user)
        return res.status(401).json({
          message:
            'The email address ' +
            req.body.email +
            ' is not associated with any account. Double-check your email address and try again.',
        });

      //Generate and set password reset token
      user.generatePasswordReset(user);

      // Save the updated user object
      await user.save();

      // send email
      const Maildata = {}

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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async  reset(req: Request, res: Response) {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
      const { token } = req.params;
      let userModel = utils.getUserModel(reqUser);
      const user = await userModel.findOne({
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
      const { token } = req.params;
      let userModel = utils.getUserModel(reqUser);
      const user = await userModel.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [Op.gt]: Date.now(), // soon to be replaced by [Op.lte]
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
      await user.save();

      let subject = 'Your password has been changed';
      let to = user.email;
      let from = process.env.FROM_EMAIL;
      let html = `<p>Hi ${user.firstName}</p>
                  <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`;

      await utils.sendEmail({ to, from, subject, html });

      res.status(200).json({ message: 'Your password has been updated.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async changePassword(req: any, res: Response) {
    const userId = req.user.id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (!newPassword || !oldPassword) {
      res.json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      try {
        const reqUser = req.params.user;
        let userModel = utils.getUserModel(reqUser);

        const user = await userModel.findOne({
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
        await user.save();

        res.json({
          status: true,
          message: 'Password Changed Successfully',
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async testMail (req:any,res:Response){
    const {users,email} = req.params;
    console.log(email,email);
    let userModel = utils.getUserModel(users);
    
      const user = await userModel.findOne({
        where: { email },
      });
    const token = user.generateVerificationToken();
      // Save the verification token
      await token.save();
      const Maildata = {}

      Maildata['subject'] = 'Account Verification Token';
      Maildata['to'] = user.email;
      Maildata['from'] = process.env.FROM_EMAIL;
      Maildata['token'] = token.token;
      Maildata['firstName'] = user.firstName;
      Maildata['templatehtml'] = "verifyToken.html";
      await utils.sendEmail(Maildata)
      console.log(Maildata);
      return res.status(200).json({status:"successful"})
  }
}
