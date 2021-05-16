"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const SubCategory_1 = require("./SubCategory");
const database_1 = require("../config/database");
class Category extends sequelize_1.Model {
}
exports.Category = Category;
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    alias: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    imageLarge: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    imageSmall: {
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
    tableName: 'categories',
    sequelize: database_1.database,
});
Category.SubCategory = Category.hasMany(SubCategory_1.SubCategory);
Category.sync({ force: false }).then(() => console.log('Categories table created'));
