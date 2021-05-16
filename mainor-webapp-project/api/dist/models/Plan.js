"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Plan extends sequelize_1.Model {
}
exports.Plan = Plan;
// Sequelize Model
Plan.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
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
    tableName: 'plans',
    sequelize: database_1.database,
});
Plan.sync({ force: false }).then(() => console.log('Plans table created'));
