"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerToken = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Customer Interface
class CustomerToken extends sequelize_1.Model {
}
exports.CustomerToken = CustomerToken;
// Sequelize Model
CustomerToken.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: {
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
    tableName: 'customerTokens',
    sequelize: database_1.database,
});
CustomerToken.sync({ force: false }).then(() => console.log('Customer Token table created'));
