import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

import { Customer } from './Customer';
import { Dispute } from './Dispute';
import { Merchant } from './Merchant';
import { OrderStatus } from './OrderStatus';
import { Product } from './Product';
import { database } from '../config/database';

// Order Interface
export class Order extends Model {
  public customerId!: number;
  public orderId!: string;
  public merchantId!: number;
  public productId!: number;
  public agreedPrice!: number;
  public deliveryPrice!: number;
  public quantity!: number;
  public deliveryInformation!: any;
  public deliveryPartnerId!: string;
  public insured!: boolean;
  public paymentStatus!: string;
  public paymentMethod!: string;
  public orderType!: string;
  public orderStatusId!: number;
  public meta!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    agreedPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    deliveryPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    deliveryInformation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deliveryPartnerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderStatusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    meta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  },
  {
    tableName: 'orders',
    sequelize: database,
  },
);

Order.hasOne(Product, {
  sourceKey: 'productId',
  foreignKey: 'id',
  as: 'product',
});

Order.hasOne(OrderStatus, {
  sourceKey: 'orderStatusId',
  foreignKey: 'id',
  as: 'orderStatus',
});

Order.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

Order.sync({ force: false }).then(() => console.log('Orders table created'));

export interface OrderInterface {
  customerId: number;
  orderId: string; // Generate order ID
  merchantId: number;
  productId: number;
  agreedPrice: number;
  deliveryPrice: number;
  quantity: number;
  deliveryInformation: any;
  deliveryPartnerId: string;
  insured: boolean;
  paymentStatus: string;
  paymentType: string; // Bank Transfer, Online Payment //
  paymentMethod: string;
  orderType: string;
  orderStatusId: number;
  meta: string;
}
