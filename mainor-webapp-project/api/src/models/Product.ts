import { DataTypes, Model, Sequelize } from 'sequelize';

import { Category } from './Category';
import { Merchant } from './Merchant';
import { ProductImage } from './ProductImage';
import { SubCategory } from './SubCategory';
import { database } from '../config/database';

const PROTECTED_ATTRIBUTES = ['password'];

// Product Interface
export class Product extends Model {
  public name!: string;
  public categoryId!: number;
  public subCategoryId!: number;
  public merchantId!: number;
  public specification!: string;
  public price!: number;
  public weight!: number;
  public unit!: string;
  public mo!: number; // minimum-order
  public description!: string;
  public goodsInStock!: number;
  public visible!: boolean;
  public approved!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  toJSON() {
    const attributes = Object.assign({}, this.get());
    for (const a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  }
}

// Sequelize Model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    subCategoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    specification: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    goodsInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  },
  {
    tableName: 'products',
    sequelize: database,
  },
);

Product.hasOne(SubCategory, {
  sourceKey: 'subCategoryId',
  foreignKey: 'id',
  as: 'subCategories',
});

Product.hasOne(Category, {
  sourceKey: 'categoryId',
  foreignKey: 'id',
  as: 'categories',
});

Product.hasOne(Merchant, {
  sourceKey: 'merchantId',
  foreignKey: 'id',
  as: 'merchantInfo',
});

Product.hasMany(ProductImage,  {as : 'productImage', sourceKey:'id', foreignKey : 'productId'});

Product.sync({ force: false }).then(() => console.log('Products table created'));

// Product Interface
export interface ProductInterface {
  name: string;
  categoryId: number;
  subCategoryId: number;
  merchantId: number;
  specification: string;
  price: number;
  weight: number;
  unit: string;
  mo: number;
  description: string;
  goodsInStock: number;
  visible: boolean;
  approved: boolean;
}