"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Config extends sequelize_1.Model {
}
exports.Config = Config;
Config.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    key: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.TEXT,
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
    tableName: 'Configs',
    sequelize: database_1.database,
});
Config.sync({ force: false }).then(() => console.log('Config table created'));
