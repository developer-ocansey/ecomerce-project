import { DataTypes, Model, Sequelize } from 'sequelize';

import { Product } from './Product';
import { database } from '../config/database';

export class Cart extends Model {
  public customerId!: number;
  public productId!: number;
  public quantity!: number;
  public insure!: boolean;
  public negotiatedPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
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
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    insure: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    negotiatedPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
    tableName: 'carts',
    sequelize: database,
  },
);


Cart.hasOne(Product, {
  sourceKey: 'productId',
  foreignKey: 'id',
  as: 'product',
});


Cart.sync({ force: false }).then(() => console.log('Carts table created'));

// Cart Interface
export interface CartInterface {
  customerId: number;
  productId: number;
  quantity: number;
  insure: boolean;
  negotiatedPrice: number;
}
