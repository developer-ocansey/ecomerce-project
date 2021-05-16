import { DataTypes, Model, Sequelize } from 'sequelize';

import { Messages } from './Messages';
import { database } from '../config/database';

export class AdjustPrice extends Model {
  public id!: number;
  public messageId!: number;
  public customerId!: number;
  public merchantId!: number;
  public agreedPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdjustPrice.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    agreedPrice: {
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
    tableName: 'AdjustPrices',
    sequelize: database,
  },
);

AdjustPrice.sync({ force: false }).then(() => console.log('AdjustPrices table created'));

// AdjustPrice Interface
export interface AdjustPriceInterface {
  messageId: number;
  customerId: number;
  merchantId: number;
  agreedPrice: number;
}
