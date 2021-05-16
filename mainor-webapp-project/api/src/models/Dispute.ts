import { DataTypes, Model, Sequelize } from 'sequelize';

import { Customer } from './Customer';
import { Merchant } from './Merchant';
import { Order } from './Order';
import { database } from '../config/database';

// Dispute Interface ...
export class Dispute extends Model {
  public customerId!: number;
  public merchantId!: number;
  public orderId!: number;
  public complaint!: string;
  public category!: string;
  public resolved!: boolean;
  public resolution!: string;
  public disputeStatus!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
Dispute.init(
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
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    complaint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    disputeStatus: {
      type: DataTypes.STRING,
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
    tableName: 'disputes',
    sequelize: database,
  },
);

Dispute.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

Dispute.belongsTo(Merchant, {
  foreignKey: 'merchantId',
  as: 'merchant',
});

Dispute.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

Dispute.sync({ force: false }).then(() => console.log('Disputes table created'));

export interface DisputeInterface {
  customerId: number;
  merchantId: number;
  orderId: number;
  complaint: string;
  category: string;
  resolved: boolean;
  resolution: string;
  disputeStatus: string;
}
