"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupAddress = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class PickupAddress extends sequelize_1.Model {
}
exports.PickupAddress = PickupAddress;
// Sequelize Model
PickupAddress.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fullAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    deliveryTime: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    pickupTime: {
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
    tableName: 'PickupAddresss',
    sequelize: database_1.database,
});
PickupAddress.sync({ force: false }).then(() => console.log('PickupAddresss table created'));
