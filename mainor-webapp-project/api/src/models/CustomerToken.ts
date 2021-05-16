import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

// Customer Interface
export class CustomerToken extends Model {
  public customerId!: number;
  public token!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
CustomerToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
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
    tableName: 'customerTokens',
    sequelize: database,
  },
);

CustomerToken.sync({ force: false }).then(() => console.log('Customer Token table created'));
// CustomerToken Interface
export interface CustomerTokenInterface {
  customerId: number;
  token: number;
}
