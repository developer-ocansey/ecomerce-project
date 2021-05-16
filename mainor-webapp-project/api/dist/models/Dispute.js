"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispute = void 0;
const sequelize_1 = require("sequelize");
const Customer_1 = require("./Customer");
const Merchant_1 = require("./Merchant");
const Order_1 = require("./Order");
const database_1 = require("../config/database");
// Dispute Interface ...
class Dispute extends sequelize_1.Model {
}
exports.Dispute = Dispute;
// Sequelize Model
Dispute.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    merchantId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    complaint: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    resolved: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    resolution: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    disputeStatus: {
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
    tableName: 'disputes',
    sequelize: database_1.database,
});
Dispute.belongsTo(Customer_1.Customer, {
    foreignKey: 'customerId',
    as: 'customer',
});
Dispute.belongsTo(Merchant_1.Merchant, {
    foreignKey: 'merchantId',
    as: 'merchant',
});
Dispute.belongsTo(Order_1.Order, {
    foreignKey: 'orderId',
    as: 'order',
});
Dispute.sync({ force: false }).then(() => console.log('Disputes table created'));
