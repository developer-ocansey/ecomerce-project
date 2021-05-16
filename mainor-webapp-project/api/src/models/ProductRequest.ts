import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

// ProductRequest Interface
export class ProductRequest extends Model {
  public title!: string;
  public description!: number;
  public imageURL!: string;
}

ProductRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.STRING,
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
    tableName: 'productRequests',
    sequelize: database,
  },
);

ProductRequest.sync({ force: false }).then(() => console.log('Product Images table created'));

// ProductRequest Interface
export interface ProductRequest {
  title: string;
  description: number;
  imageURL: string;
}
