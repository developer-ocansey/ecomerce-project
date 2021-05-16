import { DataTypes, Model, Sequelize } from 'sequelize';

import { SubCategory } from './SubCategory';
import { database } from '../config/database';

export class Category extends Model {
  public id!: number;
  public name!: string;
  public alias!: string;
  public imageLarge!: string;
  public imageSmall!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static SubCategory: any;
  static Category: CategoryInterface;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    imageLarge: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    imageSmall: {
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
    tableName: 'categories',
    sequelize: database,
  },
);

Category.SubCategory = Category.hasMany(SubCategory);

Category.sync({ force: false }).then(() => console.log('Categories table created'));

export interface CategoryInterface {
  name: string;
  alias: string;
  imageLarge: string;
  imageSmall: string;
}
