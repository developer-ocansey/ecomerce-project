import { AdminToken, AdminTokenInterface } from './AdminToken';
import { DataTypes, Model, Sequelize } from 'sequelize';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { database } from '../config/database';
import jwt from 'jsonwebtoken';

const PROTECTED_ATTRIBUTES = ['password'];

// Admin Interface
export class Admin extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public isVerified!: boolean;
  public approved!: number;
  public resetPasswordToken!: string;
  public resetPasswordExpires!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  comparePassword!: (password: string) => boolean;
  generateJWT!: () => string;
  generatePasswordReset!: (customer: any) => void;
  generateVerificationToken!: () => AdminTokenInterface;
  static AdminToken: any;

  toJSON() {
    const attributes = Object.assign({}, this.get());
    for (const a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  }
}

// Sequelize Model
Admin.init(
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
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    approved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
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
    tableName: 'admins',
    sequelize: database,
    // defaultScope: {
    //   attributes: { exclude: ['password'] },
    // }
  },
);
// Relationships

Admin.AdminToken = Admin.hasMany(AdminToken);

Admin.sync({ force: false }).then(() => console.log('Admin table created'));

Admin.beforeSave((admin, options) => {
  if (admin.changed('password')) {
    admin.password = bcrypt.hashSync(admin.password, bcrypt.genSaltSync(10));
  }
});

Admin.prototype.comparePassword = function comparePassword(password: string) {
  return bcrypt.compareSync(password, this.password);
};

Admin.prototype.generateJWT = function generateJWT() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  let payload = {
    id: this.id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    userType: 'admin',
  };

  return jwt.sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: Math.floor(expirationDate.getTime() / 1000),
  });
};

Admin.prototype.generatePasswordReset = function generatePasswordReset(admin: AdminInterface) {
  admin.resetPasswordToken = crypto.randomBytes(3).toString('hex');
  admin.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

Admin.prototype.generateVerificationToken = function generateVerificationToken() {
  let payload = {
    adminId: this.id,
    token: crypto.randomBytes(3).toString('hex'),
  };

  return new AdminToken(payload);
};

export interface AdminInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isVerified: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: number; //complete types
}
