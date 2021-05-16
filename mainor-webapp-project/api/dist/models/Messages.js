"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const AdjustPrice_1 = require("./AdjustPrice");
class Messages extends sequelize_1.Model {
}
exports.Messages = Messages;
Messages.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    messageListId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    sentBy: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    message: {
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
    tableName: 'messages',
    sequelize: database_1.database,
});
AdjustPrice_1.AdjustPrice.hasOne(AdjustPrice_1.AdjustPrice, {
    sourceKey: 'messageId',
    foreignKey: 'id',
    as: 'price',
});
Messages.sync({ force: false }).then(() => console.log('Messagess table created'));
