import { DataTypes, Model, Sequelize } from 'sequelize';

import { database } from '../config/database';

export class FAQ extends Model {
  public categoryId!: number;
  public question!: string;
  public answer!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FAQ.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    FAQCategoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
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
    tableName: 'faqs',
    sequelize: database,
  },
);

FAQ.sync({ force: false }).then(() => console.log('FAQ table created'));

// FAQ Interface
export interface FAQInterface {
    categoryId: number;
    question: string;
    answer: string;
}

