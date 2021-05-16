import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

export class OrderStatus extends Model {
  status!: string;
  description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderStatus.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'orderStatuses',
    sequelize: database,
  },
);

OrderStatus.sync({ force: false }).then(() => console.log('OrderStatus table created'));

export interface OrderStatusInterface {
  status: string;
  description: string;
}
