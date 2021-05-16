import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

export class Plan extends Model {
  public name!: string;
  public description!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
Plan.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'plans',
    sequelize: database,
  },
);

Plan.sync({ force: false }).then(() => console.log('Plans table created'));

// Plan Interface
export interface PlanInterface {
  name: string;
  description: string;
  price: number;
}
