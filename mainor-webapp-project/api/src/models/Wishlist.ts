import { DataTypes, Model, Sequelize } from 'sequelize';

import { Customer } from './Customer';
import { Product } from './Product';
import { database } from '../config/database';

// Wishlist Interface
export class Wishlist extends Model {
  public customerId!: number;
  public productId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'wishlists',
    sequelize: database,
  },
);

Wishlist.hasOne(Product, {
  sourceKey: 'productId',
  foreignKey: 'id',
  as: 'product',
});

Wishlist.sync({ force: false }).then(() => console.log('Wishlist Tables table created'));

// Wishlist Interface
export interface WishlistInterface {
  customerId: number;
  productId: number;
}
