import { DataTypes, Model, Sequelize } from 'sequelize';

import { Product } from './Product';
import { database } from '../config/database';
import { AdjustPrice } from "./AdjustPrice";

export class Messages extends Model {
  public messageListId!: number;
  public sentBy!: string;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Messages.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    messageListId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sentBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
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
    tableName: 'messages',
    sequelize: database,
  },
);


AdjustPrice.hasOne(AdjustPrice, {
  sourceKey: 'messageId',
  foreignKey: 'id',
  as: 'price',
});


Messages.sync({ force: false }).then(() => console.log('Messagess table created'));

// Messages Interface
export interface MessagesInterface {
    messageListId: number;
    sentBy: string;
    message: string;
}
