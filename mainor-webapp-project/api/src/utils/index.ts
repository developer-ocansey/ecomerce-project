import { Admin } from '../models/Admin';
import { AdminToken } from '../models/AdminToken';
import { Customer } from '../models/Customer';
import { CustomerToken } from '../models/CustomerToken';
import { Merchant } from '../models/Merchant';
import { MerchantToken } from '../models/MerchantToken';
import fs from 'fs'
import handlebars from 'handlebars';
import path from 'path';
import sgMail from '@sendgrid/mail';
export class Utils {
    private readHTMLFile (path:any, callback:any) {
      fs.readFile(path, {encoding: 'utf-8'}, function (err:any, html:any) {
          if (err) {
              throw err;
              callback(err);
          }
          else {
              callback(null, html);
          }
      });
  }
  public sendEmail(data: any) {
    // define type for mailOptions
    const template = path.join(__dirname + '/../' + `/public/${data.templatehtml}`)
    this.readHTMLFile(template, function(err:any, html:any) {
      var template = handlebars.compile(html);
      var replacements = data;
      var htmlToSend = template(replacements);

      var mailOptions = {
          from: `bcdng <${data.from}>`,
          to : data.to,
          subject : data.subject,
          html : htmlToSend
      };
  
      return new Promise((resolve, reject) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
        sgMail
          .send(mailOptions)
          .then((result: any) => {
            console.log(result)
            return resolve(result);
          })
          .catch((error: any) => {
            return reject(error);
          });
      });
    })
  }
  

  public getUserModel(user: string) {
    let Model: any;
    if (user === 'customer') {
      Model = Customer;
    } else if (user === 'admin') {
      Model = Admin;
    } else {
      Model = Merchant;
    }
    return Model;
  }

  public getUserTokenModel(user: string) {
    let ModelToken: any;
    if (user === 'customer') {
      ModelToken = CustomerToken;
    } else if (user === 'admin') {
      ModelToken = AdminToken;
    } else {
      ModelToken = MerchantToken;
    }
    return ModelToken;
  }

  public getUserId(user: string, token) {
    let userId: any;
    if (user === 'customer') {
      userId = token.customerId;
    } else if (user === 'admin') {
      userId = token.adminId;
    } else {
      userId = token.merchantId;
    }
    return userId;
  }

  public isEmptyObject = (obj: any) => {
    //Refactor any
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  };

  public checkUserGroup(res, reqUser: string) {
    if (['customer', 'admin', 'merchant'].includes(reqUser)) {
      return;
    }
    return res.status(401).json({
      status: false,
      message: 'Invalid user group',
    });
  }

  public async getUserData(user, id) {
    let usersData: any;
    if (user === 'customer') {
      usersData = await Customer.findByPk(id);
    } else if (user === 'admin') {
      usersData = await Admin.findByPk(id);
    } else {
      usersData = await Merchant.findByPk(id);
    }
    return usersData;
  }

  public formatResponse(res: any, status: boolean = false, message: string = 'Error', data: any = {}) {
    res.json({
      status: status,
      message: message,
      data: data,
    });
  }
}
