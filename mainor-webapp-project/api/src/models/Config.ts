import { DataTypes, Model, Sequelize } from 'sequelize';

import { database } from '../config/database';

export class Config extends Model {
  public key!: number;
  public value!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Config.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
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
    tableName: 'Configs',
    sequelize: database,
  },
);

Config.sync({ force: false }).then(() => console.log('Config table created'));

// Config Interface
export interface ConfigInterface {
    key: number;
    value: string;
}

