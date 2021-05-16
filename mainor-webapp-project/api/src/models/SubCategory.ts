import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

export class SubCategory extends Model {
  public id!: number;
  public categoryId!: number;
  public name!: string;
  public alias!: string;
  public image!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SubCategory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING(128),
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
    tableName: 'subCategories',
    sequelize: database,
  },
);

SubCategory.sync({ force: false }).then(() => console.log('Sub Categories table created'));

export interface SubCategoryInterface {
  name: string;
  alias: string;
  categoryId: number;
  image: string;
}