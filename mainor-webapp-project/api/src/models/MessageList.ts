import { DataTypes, Model, Sequelize } from 'sequelize';

import { Customer } from './Customer';
import { Merchant } from './Merchant';
import { Product } from "./Product";
import { database } from '../config/database';

export class MessageList extends Model {
  public customerId!: number;
  public merchantId!: number;
  public productId!: number;
  public title!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static Product: any;
  static MessageList: MessageListInterface;
}

MessageList.init(
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
    merchantId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
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
    tableName: 'messageList',
    sequelize: database,
  },
);

MessageList.hasOne(Product, {
  sourceKey: 'productId',
  foreignKey: 'id',
  as: 'product',
});
MessageList.hasOne(Customer, {
  sourceKey: 'customerId',
  foreignKey: 'id',
  as: 'customerInfo',
});

MessageList.sync({ force: false }).then(() => console.log('MessageLists table created'));

// MessageList Interface
export interface MessageListInterface {
    customerId: number;
    merchantId: number;
    productId: number;
    title: string;
}
