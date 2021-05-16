import { DataTypes, Model, Sequelize } from 'sequelize';

import { Product } from './Product';
import { database } from '../config/database';

// ProductImage Interface
export class ProductImage extends Model {
  public productId!: number;
  public imageURL!: string;
}

// Sequelize Model
ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'productImages',
    sequelize: database,
  },
);


ProductImage.sync({ force: false }).then((res) => console.log('Product Images table created'));

// ProductImage Interface
export interface ProductImageInterface {
  productId: number;
  imageURL: string;
}
