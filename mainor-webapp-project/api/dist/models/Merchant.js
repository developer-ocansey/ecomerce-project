"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merchant = void 0;
const sequelize_1 = require("sequelize");
const MerchantToken_1 = require("./MerchantToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PROTECTED_ATTRIBUTES = ['password'];
// Merchant Interface
class Merchant extends sequelize_1.Model {
    toJSON() {
        const attributes = Object.assign({}, this.get());
        for (const a of PROTECTED_ATTRIBUTES) {
            delete attributes[a];
        }
        return attributes;
    }
}
exports.Merchant = Merchant;
// Sequelize Model
Merchant.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    businessName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    businessLogo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rcNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    businessAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    market: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bank: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bankName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bankAcct: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    planId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    approved: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.fn('NOW'),
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.fn('NOW'),
    },
}, {
    tableName: 'merchants',
    sequelize: database_1.database,
});
Merchant.sync({ force: false }).then(() => console.log('Merchants table created'));
Merchant.beforeSave((admin) => {
    if (admin.changed('password')) {
        admin.password = bcryptjs_1.default.hashSync(admin.password, bcryptjs_1.default.genSaltSync(10));
    }
});
Merchant.prototype.comparePassword = function comparePassword(password) {
    return bcryptjs_1.default.compareSync(password, this.password);
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
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || '', {
        expiresIn: Math.floor(expirationDate.getTime() / 1000),
    });
};
Merchant.prototype.generatePasswordReset = function generatePasswordReset(admin) {
    admin.resetPasswordToken = crypto_1.default.randomBytes(3).toString('hex');
    admin.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
Merchant.prototype.generateVerificationToken = function generateVerificationToken() {
    let payload = {
        merchantId: this.id,
        token: crypto_1.default.randomBytes(3).toString('hex'),
    };
    return new MerchantToken_1.MerchantToken(payload);
};
