"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategory = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class SubCategory extends sequelize_1.Model {
}
exports.SubCategory = SubCategory;
SubCategory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    alias: {
        type: sequelize_1.DataTypes.STRING(128),
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
    tableName: 'subCategories',
    sequelize: database_1.database,
});
SubCategory.sync({ force: false }).then(() => console.log('Sub Categories table created'));
