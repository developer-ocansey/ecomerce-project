import { Request, Response } from 'express';

import { Utils } from '../../utils/index';
import s3 from '../../config/s3.config.js';

const utils = new Utils();
export class AuthController {
  register = async (req: Request, res: Response) => {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
      const { email, phone } = req.body;
      let userModel = utils.getUserModel(reqUser);
      // Make sure this account email has not been used already
      const emailExist = await userModel.findOne({
        where: { email },
      });

      const phoneExist = await userModel.findOne({
        where: { phone },
      });

      if (emailExist) {
        return res.json({
          status: false,
          message: 'Email address is already associated with another account',
        });
      }

      if (phoneExist) {
        return res.json({
          status: false,
          message: 'Phone No is already associated with another account',
        });
      }

      const user = new userModel({
        ...req.body,
        role: 'basic',
      });

      const saveUser = await user.save();
      if (saveUser) {
        const token = saveUser.generateVerificationToken();
        await token.save();
        const Maildata = {}

        Maildata['subject'] = 'Account Verification Token';
        Maildata['to'] = saveUser.email;
        Maildata['from'] = process.env.FROM_EMAIL;
        Maildata['token'] = token.token;
        Maildata['firstName'] = (reqUser=="customer")?saveUser.firstName:saveUser.businessName;
        Maildata['templatehtml'] = 'verifyToken.html';
        utils.sendEmail(Maildata);

        res.json({
          status: true,
          message: `A verification email has been sent to ${saveUser.email}.`,
        });
      }
      
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.json({ status: false, message: 'Email and password field can not be empty' });
      }

      let userModel = await utils.getUserModel(reqUser);

      const findUser = await userModel.findOne({
        where: { email },
      });

      if (!findUser) {
        return res.json({
          status: false,
          message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`,
        });
      }

      // validate password
      if (!findUser.comparePassword(password)) return res.json({ status: false, message: 'Invalid password' });
      // Make sure the user has been verified
      if (!findUser.isVerified) {
        return res.json({
          status: false,
          type: 'not-verified',
          message: 'Your account has not been verified.',
        });
      }

      if (findUser.approved == 0) {
        return res.json({
          status: false,
          message: 'Your account has been temporarily locked. Please Contact Admin',
        });
      }

      // Login successful, write token, and send back user
      res.json({
        status: true,
        token: findUser.generateJWT(),
        user: findUser,
      });
    } catch (error) {
      res.json({ message: error.message });
    }
  };

  verify = async (req: Request, res: Response) => {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    if (!req.params.token) {
      return res.json({
        status: false,
        message: 'We were unable to find a user for this token.',
      });
    }
    let userModel = await utils.getUserModel(reqUser);
    let userModelToken = await utils.getUserTokenModel(reqUser);

    try {
      // Find a matching token
      const token = await userModelToken.findOne({
        where: { token: req.params.token },
      });

      if (!token) {
        return res.json({
          status: false,
          message: 'We were unable to find a valid token. Your token my have expired.',
        });
      }

      let userId = await utils.getUserId(reqUser, token);
      // console.log("userId", userId)
      // If we found a token, find a matching user
      userModel
        .findOne({
          where: { id: userId },
        })
        .then((user) => {
          // console.log("verify",user)
          if (!user) {
            return res.json({
              status: false,
              message: 'We were unable to find a user for this token.',
            });
          }

          if (user.isVerified) {
            return res.json({
              status: false,
              message: 'This user has already been verified.',
            });
          }

          // Verify and save the user
          user.isVerified = true;
          user
            .save()
            .then(async (result: any) => {
              if (result) {
                if(reqUser=="merchant"){
                  const Maildata = {}

                  Maildata['subject'] = 'Welcome';
                  Maildata['to'] = result.email;
                  Maildata['MerchantfirstName'] = user.firstName;
                  Maildata['from'] = process.env.FROM_EMAIL;
                  Maildata['templatehtml'] = "firstTimerMerchant.html";
                  utils.sendEmail(Maildata);
                }
                else if(reqUser=="customer"){
                  const Maildata = {}

                  Maildata['subject'] = 'Welcome';
                  Maildata['to'] = result.email;
                  Maildata['CustomerfirstName'] = result.firstName;
                  Maildata['from'] = process.env.FROM_EMAIL;
                  Maildata['templatehtml'] = "firstTimer.html";
                  utils.sendEmail(Maildata);
                }
              
              
                return res.send({ status: true, message: 'The account has been verified. Please log in.' });
              }

              return res.json({ status: false, message: 'An error occured whild verifying users account' });
            })
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      res.json({
        status: false,
        message: error.message,
      });
    }
  };

  resendToken = async (req: Request, res: Response) => {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    let userModel = utils.getUserModel(reqUser);
    try {
      const { email } = req.body;
      const user = await userModel.findOne({
        where: { email },
      });

      if (!user) {
        return res.json({
          status: false,
          message: `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`,
        });
      }

      if (user.isVerified) {
        return res.json({
          status: false,
          message: 'This account has already been verified. Please log in.',
        });
      }

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
      utils.sendEmail(Maildata);

      res.json({
        status: true,
        message: `A verification email has been sent to ${user.email}.`,
      });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  };

  // async sendVerificationEmail(
  //   user: any, // refactor
  //   res: Response,
  // ) {
  //   try {
  //     const token = user.generateVerificationToken();
  //     // Save the verification token
  //     await token.save();
  //     const subject = 'Account Verification Token';
  //     const to = user.email;
  //     const from = process.env.FROM_EMAIL;

  //     const html = `<p>Hi ${user.firstName}<p><br>
  //                   <p>Please use this token <b>${token.token}</b> to verify your account.</p><br>
  //                   <p>If you did not request this, please ignore this email.</p>`;
  //     await utils.sendEmail({ to, from, subject, html });
  //     res.json({
  //       status: true,
  //       message: `A verification email has been sent to ${user.email}.`,
  //     });
  //   } catch (error) {
  //     res.json({ message: error.message });
  //   }
  // }

  profile = async (req: any, res: Response) => {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
      const id = req.user.id;
      let user = await utils.getUserData(reqUser, id);

      if (!user) {
        return res.json({
          message: 'User does not exist',
        });
      }

      res.json({ status: true, user });
    } catch (error) {
      res.json({
        status: false,
        message: error.message,
      });
    }
  };

  userInfo = async (req: any, res: Response) => {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
      const id = req.params.id;
      let user = await utils.getUserData(reqUser, id);

      if (!user) {
        return res.json({
          message: 'User does not exist',
        });
      }

      res.json({ user });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  };

  updateProfile = async (req: any, res: Response) => {
    try {
      const id = req.user.id;
      const data = req.body;
      const reqUser = req.params.user;

      let userModel = utils.getUserModel(reqUser);
      await userModel
        .findByPk(id)
        .then((userProfile) => {
          if (!userProfile) {
            return res.json({ status: false, message: 'User Account does not exist' });
          }

          // Check if a data as passed
          if (!data) {
            return res.json({ status: false, message: 'Please provide some data' });
          }

          // Remove the Id Key from the data passed
          if (data.id) {
            delete data.id;
          }

          // Update the data to database
          userModel
            .update(req.body, {
              fields: Object.keys(req.body),
              where: { id: id },
            })
            .then(() => {
              res.status(200).json({
                status: true,
                message: 'User profile Updated successfully',
                info: data,
              });
            })
            .catch((err) => {
              res.json({ err });
            });
        })
        .catch((err) => {
          res.json({ status: false, message: err });
        });
    } catch (err) {
      res.json(err);
    }
  };

  uploadProfilePicture = async (req: any, res: Response) => {
    const reqUser = req.params.user;
    utils.checkUserGroup(res, reqUser);
    try {
    
      const id = req.user.id;
      const s3Client = s3.s3Client;
      const params = s3.uploadParams;

      let userModel = utils.getUserModel(reqUser);

      params.Key = req.file.originalname;
      params.Body = req.file.buffer;
      params.ACL = 'public-read';

      await s3Client.upload(params, (err: string, data: any) => {
        if (err) {
          res.status(500).json({ error: 'Error -> ' + err });
        }

        // Update the data to database
        userModel
        .update({businessLogo: data.Location}, {where: { id: id}})
        .then((data) => {})
        .catch((err) => {
          res.json({ err });
        });
        
        res.status(200).json({
          status: true,
          data: data, 
          message: 'File uploaded successfully! -> keyname = ' + req.file.originalname 
        });
      });

    } catch (err) {
      res.json(err);
    }
  }
  
}
