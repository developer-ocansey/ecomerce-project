"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQCategory = void 0;
const sequelize_1 = require("sequelize");
const FAQ_1 = require("./FAQ");
const database_1 = require("../config/database");
class FAQCategory extends sequelize_1.Model {
}
exports.FAQCategory = FAQCategory;
FAQCategory.init({
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
    tableName: 'faqCategories',
    sequelize: database_1.database,
});
FAQCategory.FAQ = FAQCategory.hasMany(FAQ_1.FAQ);
FAQCategory.sync({ force: false }).then(() => console.log('FAQCategory table created'));
