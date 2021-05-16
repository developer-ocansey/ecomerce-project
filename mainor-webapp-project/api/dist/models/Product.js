"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const Category_1 = require("./Category");
const Merchant_1 = require("./Merchant");
const ProductImage_1 = require("./ProductImage");
const SubCategory_1 = require("./SubCategory");
const database_1 = require("../config/database");
const PROTECTED_ATTRIBUTES = ['password'];
// Product Interface
class Product extends sequelize_1.Model {
    toJSON() {
        const attributes = Object.assign({}, this.get());
        for (const a of PROTECTED_ATTRIBUTES) {
            delete attributes[a];
        }
        return attributes;
    }
}
exports.Product = Product;
// Sequelize Model
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    subCategoryId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    merchantId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    specification: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    unit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    goodsInStock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    visible: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    approved: {
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
    tableName: 'products',
    sequelize: database_1.database,
});
Product.hasOne(SubCategory_1.SubCategory, {
    sourceKey: 'subCategoryId',
    foreignKey: 'id',
    as: 'subCategories',
});
Product.hasOne(Category_1.Category, {
    sourceKey: 'categoryId',
    foreignKey: 'id',
    as: 'categories',
});
Product.hasOne(Merchant_1.Merchant, {
    sourceKey: 'merchantId',
    foreignKey: 'id',
    as: 'merchantInfo',
});
Product.hasMany(ProductImage_1.ProductImage, { as: 'productImage', sourceKey: 'id', foreignKey: 'productId' });
Product.sync({ force: false }).then(() => console.log('Products table created'));
