"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const Customer_1 = require("./Customer");
const OrderStatus_1 = require("./OrderStatus");
const Product_1 = require("./Product");
const database_1 = require("../config/database");
// Order Interface
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    orderId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    merchantId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    productId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    agreedPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    deliveryPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    deliveryInformation: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    deliveryPartnerId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    insured: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    orderType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    orderStatusId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.fn('NOW'),
    },
    meta: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.fn('NOW'),
    },
}, {
    tableName: 'orders',
    sequelize: database_1.database,
});
Order.hasOne(Product_1.Product, {
    sourceKey: 'productId',
    foreignKey: 'id',
    as: 'product',
});
Order.hasOne(OrderStatus_1.OrderStatus, {
    sourceKey: 'orderStatusId',
    foreignKey: 'id',
    as: 'orderStatus',
});
Order.belongsTo(Customer_1.Customer, {
    foreignKey: 'customerId',
    as: 'customer',
});
Order.sync({ force: false }).then(() => console.log('Orders table created'));
