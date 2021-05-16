"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryPartner = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class DeliveryPartner extends sequelize_1.Model {
}
exports.DeliveryPartner = DeliveryPartner;
DeliveryPartner.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    api: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
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
    tableName: 'deliveryPartners',
    sequelize: database_1.database,
});
DeliveryPartner.sync({ force: false }).then(() => console.log('DeliveryPartners table created'));
