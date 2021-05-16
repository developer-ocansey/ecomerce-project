import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

// MerchantToken Interface
export class MerchantToken extends Model {
  public merchantId!: number;
  public token!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
MerchantToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    token: {
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
    tableName: 'merchantTokens',
    sequelize: database,
  },
);

MerchantToken.sync({ force: false }).then(() => console.log('Merchant token table created'));

// MerchantToken Interface
export interface MerchantTokenInterface {
  merchantId: number;
  token: number;
}
