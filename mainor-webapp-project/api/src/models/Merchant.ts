import { DataTypes, Model, Sequelize } from 'sequelize';
import { MerchantToken, MerchantTokenInterface } from './MerchantToken';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { database } from '../config/database';
import jwt from 'jsonwebtoken';

const PROTECTED_ATTRIBUTES = ['password'];

// Merchant Interface
export class Merchant extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public businessName!: string;
  public businessLogo!: string;
  public rcNumber!: string;
  public location!: string;
  public businessAddress!: string;
  public market!: string;
  public bank!: string;
  public bankName!: string;
  public bankAcct!: string;
  public planId!: number;
  public isVerified!: boolean;
  public approved!: number;
  public resetPasswordToken!: string;
  public resetPasswordExpires!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  comparePassword!: (password: string) => boolean;
  generateJWT!: () => string;
  generatePasswordReset!: (customer: any) => void;
  generateVerificationToken!: () => MerchantTokenInterface;

  toJSON() {
    const attributes = Object.assign({}, this.get());
    for (const a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  }
}

// Sequelize Model
Merchant.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessLogo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rcNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    market: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankName:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankAcct:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    approved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  },
  {
    tableName: 'merchants',
    sequelize: database,
    // defaultScope: {
    //   attributes: { exclude: ['password'] },
    // }
  },
);

Merchant.sync({ force: false }).then(() => console.log('Merchants table created'));

Merchant.beforeSave((admin) => {
  if (admin.changed('password')) {
    admin.password = bcrypt.hashSync(admin.password, bcrypt.genSaltSync(10));
  }
});

Merchant.prototype.comparePassword = function comparePassword(password: string) {
  return bcrypt.compareSync(password, this.password);
};

Merchant.prototype.generateJWT = function generateJWT() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  let payload = {
    id: this.id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    userType: 'merchant',
  };

  return jwt.sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: Math.floor(expirationDate.getTime() / 1000),
  });
};

Merchant.prototype.generatePasswordReset = function generatePasswordReset(admin: MerchantInterface) {
  admin.resetPasswordToken = crypto.randomBytes(3).toString('hex');
  admin.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

Merchant.prototype.generateVerificationToken = function generateVerificationToken() {
  let payload = {
    merchantId: this.id,
    token: crypto.randomBytes(3).toString('hex'),
  };

  return new MerchantToken(payload);
};

// Merchant Interface
export interface MerchantInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  businessLogo: string;
  rcNumber: string;
  location: string;
  businessAddress: string;
  market: string;
  bank: string;
  bankName: string;
  bankAcct: string;
  planId: number;
  isVerified: string;
  approved: number;
  resetPasswordToken: string;
  resetPasswordExpires: number; //complete types
}
