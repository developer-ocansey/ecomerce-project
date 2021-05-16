import { DataTypes, Model, Sequelize } from 'sequelize';

import { database } from '../config/database';

export class PriceTable extends Model {
  public name!: string;
  public description!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
PriceTable.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    partnerSlug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
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
    tableName: 'PriceTables',
    sequelize: database,
  },
);

PriceTable.sync({ force: false }).then(() => console.log('PriceTables table created'));

// PriceTable Interface
export interface PriceTableInterface {
  name: string;
  description: string;
  price: number;
}
