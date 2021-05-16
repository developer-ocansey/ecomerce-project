import { CustomerToken, CustomerTokenInterface } from './CustomerToken';
import { DataTypes, Model, Sequelize } from 'sequelize';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { database } from '../config/database';
import jwt from 'jsonwebtoken';

const PROTECTED_ATTRIBUTES = ['password'];

export class Customer extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public isVerified!: boolean;
  public approved!: number;
  public resetPasswordToken!: string;
  public resetPasswordExpires!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  comparePassword!: (password: string) => boolean;
  generateJWT!: () => string;
  generatePasswordReset!: (customer: any) => void;
  generateVerificationToken!: () => CustomerTokenInterface;

  toJSON() {
    const attributes = Object.assign({}, this.get());
    for (const a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  }
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    approved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    resetPasswordToken: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE(),
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
    tableName: 'customers',
    sequelize: database,
    // defaultScope: {
    //   attributes: { exclude: ['password'] },
    // }
  },
);

Customer.sync({ force: false }).then(() => console.log('Customers table created'));

Customer.beforeSave((customer) => {
  if (customer.changed('password')) {
    customer.password = bcrypt.hashSync(customer.password, bcrypt.genSaltSync(10));
  }
});

Customer.prototype.comparePassword = function comparePassword(password: string) {
  return bcrypt.compareSync(password, this.password);
};

Customer.prototype.generateJWT = function generateJWT() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  const payload = {
    id: this.id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    userType: 'customer',
  };

  return jwt.sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: Math.floor(expirationDate.getTime() / 1000),
  });
};

Customer.prototype.generatePasswordReset = function generatePasswordReset(customer: CustomerInterface) {
  customer.resetPasswordToken = crypto.randomBytes(3).toString('hex');
  customer.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

Customer.prototype.generateVerificationToken = function generateVerificationToken() {
  const payload = {
    customerId: this.id,
    token: crypto.randomBytes(3).toString('hex'),
  };

  return new CustomerToken(payload);
};

export interface CustomerInterface {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  isVerified: boolean;
  approved: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: number; // complete types
}
