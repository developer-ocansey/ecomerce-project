"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustPrice = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class AdjustPrice extends sequelize_1.Model {
}
exports.AdjustPrice = AdjustPrice;
AdjustPrice.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    messageId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    merchantId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    agreedPrice: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
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
    tableName: 'AdjustPrices',
    sequelize: database_1.database,
});
AdjustPrice.sync({ force: false }).then(() => console.log('AdjustPrices table created'));
