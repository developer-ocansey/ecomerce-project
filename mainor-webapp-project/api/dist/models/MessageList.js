"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageList = void 0;
const sequelize_1 = require("sequelize");
const Customer_1 = require("./Customer");
const Product_1 = require("./Product");
const database_1 = require("../config/database");
class MessageList extends sequelize_1.Model {
}
exports.MessageList = MessageList;
MessageList.init({
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
    productId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
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
    tableName: 'messageList',
    sequelize: database_1.database,
});
MessageList.hasOne(Product_1.Product, {
    sourceKey: 'productId',
    foreignKey: 'id',
    as: 'product',
});
MessageList.hasOne(Customer_1.Customer, {
    sourceKey: 'customerId',
    foreignKey: 'id',
    as: 'customerInfo',
});
MessageList.sync({ force: false }).then(() => console.log('MessageLists table created'));
