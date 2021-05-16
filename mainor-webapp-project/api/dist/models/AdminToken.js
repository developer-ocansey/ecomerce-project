"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminToken = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Admin Interface
class AdminToken extends sequelize_1.Model {
}
exports.AdminToken = AdminToken;
// Sequelize Model
AdminToken.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    adminId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'adminTokens',
    sequelize: database_1.database,
});
AdminToken.sync({ force: false }).then(() => console.log('Admin Token table created'));
