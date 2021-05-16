"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const AdminToken_1 = require("./AdminToken");
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PROTECTED_ATTRIBUTES = ['password'];
// Admin Interface
class Admin extends sequelize_1.Model {
    toJSON() {
        const attributes = Object.assign({}, this.get());
        for (const a of PROTECTED_ATTRIBUTES) {
            delete attributes[a];
        }
        return attributes;
    }
}
exports.Admin = Admin;
// Sequelize Model
Admin.init({
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
    email: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    approved: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
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
    tableName: 'admins',
    sequelize: database_1.database,
});
// Relationships
Admin.AdminToken = Admin.hasMany(AdminToken_1.AdminToken);
Admin.sync({ force: false }).then(() => console.log('Admin table created'));
Admin.beforeSave((admin, options) => {
    if (admin.changed('password')) {
        admin.password = bcryptjs_1.default.hashSync(admin.password, bcryptjs_1.default.genSaltSync(10));
    }
});
Admin.prototype.comparePassword = function comparePassword(password) {
    return bcryptjs_1.default.compareSync(password, this.password);
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
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || '', {
        expiresIn: Math.floor(expirationDate.getTime() / 1000),
    });
};
Admin.prototype.generatePasswordReset = function generatePasswordReset(admin) {
    admin.resetPasswordToken = crypto_1.default.randomBytes(3).toString('hex');
    admin.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
Admin.prototype.generateVerificationToken = function generateVerificationToken() {
    let payload = {
        adminId: this.id,
        token: crypto_1.default.randomBytes(3).toString('hex'),
    };
    return new AdminToken_1.AdminToken(payload);
};
