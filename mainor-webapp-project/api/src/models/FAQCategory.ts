import { DataTypes, Model, Sequelize } from 'sequelize';
import { FAQ, FAQInterface } from './FAQ';

import { database } from '../config/database';

export class FAQCategory extends Model {
  public slug!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static FAQ: any;
  static FAQCategory: FAQCategoryInterface;
}

FAQCategory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
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
    tableName: 'faqCategories',
    sequelize: database,
  },
);
FAQCategory.FAQ = FAQCategory.hasMany(FAQ);

FAQCategory.sync({ force: false }).then(() => console.log('FAQCategory table created'));

// FAQCategory Interface
export interface FAQCategoryInterface {
  slug: string;
  name: string;
}

