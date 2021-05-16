"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Market = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Market extends sequelize_1.Model {
}
exports.Market = Market;
Market.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
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
    tableName: 'markets',
    sequelize: database_1.database,
});
Market.sync({ force: false }).then(() => console.log('Market table created'));
