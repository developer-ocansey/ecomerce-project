import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

// Admin Interface
export class AdminToken extends Model {
  public adminId!: number;
  public token!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
AdminToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    adminId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'adminTokens',
    sequelize: database,
  },
);

AdminToken.sync({ force: false }).then(() => console.log('Admin Token table created'));

// AdminToken Interface
export interface AdminTokenInterface {
  adminId: number;
  token: number;
}
