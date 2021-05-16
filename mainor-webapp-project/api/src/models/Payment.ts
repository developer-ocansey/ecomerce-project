import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';
import { Product } from './Product';
import { Merchant } from './Merchant';
import { Order } from './Order';

export class Payment extends Model {
  productId!: number;
  merchantId!: number;
  orderId!: number;
  transactionId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    transactionId: {
      // Id returned from payment provider
      type: DataTypes.STRING(128),
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
    tableName: 'payments',
    sequelize: database,
  },
);

Payment.sync({ force: false }).then(() => console.log('Payments table created'));
// Payment Interface
export interface PaymentInterface {
  productId: number;
  merchantId: number;
  orderId: number;
  transactionId: string;
}
