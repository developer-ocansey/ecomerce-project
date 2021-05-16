"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRequest = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// ProductRequest Interface
class ProductRequest extends sequelize_1.Model {
}
exports.ProductRequest = ProductRequest;
ProductRequest.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    imageURL: {
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
    tableName: 'productRequests',
    sequelize: database_1.database,
});
ProductRequest.sync({ force: false }).then(() => console.log('Product Images table created'));
