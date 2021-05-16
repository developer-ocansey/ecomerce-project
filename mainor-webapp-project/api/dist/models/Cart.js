"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const sequelize_1 = require("sequelize");
const Product_1 = require("./Product");
const database_1 = require("../config/database");
class Cart extends sequelize_1.Model {
}
exports.Cart = Cart;
Cart.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    productId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    insure: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    negotiatedPrice: {
        type: sequelize_1.DataTypes.FLOAT,
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
    tableName: 'carts',
    sequelize: database_1.database,
});
Cart.hasOne(Product_1.Product, {
    sourceKey: 'productId',
    foreignKey: 'id',
    as: 'product',
});
Cart.sync({ force: false }).then(() => console.log('Carts table created'));
