"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const CustomerToken_1 = require("./CustomerToken");
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PROTECTED_ATTRIBUTES = ['password'];
class Customer extends sequelize_1.Model {
    toJSON() {
        const attributes = Object.assign({}, this.get());
        for (const a of PROTECTED_ATTRIBUTES) {
            delete attributes[a];
        }
        return attributes;
    }
}
exports.Customer = Customer;
Customer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    approved: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
    },
    resetPasswordExpires: {
        type: sequelize_1.DataTypes.DATE(),
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
    tableName: 'customers',
    sequelize: database_1.database,
});
Customer.sync({ force: false }).then(() => console.log('Customers table created'));
Customer.beforeSave((customer) => {
    if (customer.changed('password')) {
        customer.password = bcryptjs_1.default.hashSync(customer.password, bcryptjs_1.default.genSaltSync(10));
    }
});
Customer.prototype.comparePassword = function comparePassword(password) {
    return bcryptjs_1.default.compareSync(password, this.password);
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
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || '', {
        expiresIn: Math.floor(expirationDate.getTime() / 1000),
    });
};
Customer.prototype.generatePasswordReset = function generatePasswordReset(customer) {
    customer.resetPasswordToken = crypto_1.default.randomBytes(3).toString('hex');
    customer.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};
Customer.prototype.generateVerificationToken = function generateVerificationToken() {
    const payload = {
        customerId: this.id,
        token: crypto_1.default.randomBytes(3).toString('hex'),
    };
    return new CustomerToken_1.CustomerToken(payload);
};
