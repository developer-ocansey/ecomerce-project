"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantToken = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// MerchantToken Interface
class MerchantToken extends sequelize_1.Model {
}
exports.MerchantToken = MerchantToken;
// Sequelize Model
MerchantToken.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    merchantId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
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
    tableName: 'merchantTokens',
    sequelize: database_1.database,
});
MerchantToken.sync({ force: false }).then(() => console.log('Merchant token table created'));
