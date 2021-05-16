"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
const sequelize_1 = require("sequelize");
const Product_1 = require("./Product");
const database_1 = require("../config/database");
// Wishlist Interface
class Wishlist extends sequelize_1.Model {
}
exports.Wishlist = Wishlist;
// Sequelize Model
Wishlist.init({
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
    tableName: 'wishlists',
    sequelize: database_1.database,
});
Wishlist.hasOne(Product_1.Product, {
    sourceKey: 'productId',
    foreignKey: 'id',
    as: 'product',
});
Wishlist.sync({ force: false }).then(() => console.log('Wishlist Tables table created'));
