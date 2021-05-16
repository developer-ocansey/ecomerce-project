"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceTable = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class PriceTable extends sequelize_1.Model {
}
exports.PriceTable = PriceTable;
// Sequelize Model
PriceTable.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    partnerSlug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.FLOAT,
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
    tableName: 'PriceTables',
    sequelize: database_1.database,
});
PriceTable.sync({ force: false }).then(() => console.log('PriceTables table created'));
