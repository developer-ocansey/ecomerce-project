import { DataTypes, Model, Sequelize } from 'sequelize';

import { Product } from './Product';
import { database } from '../config/database';

export class DeliveryPartner extends Model {
  public name!: string;
  public logo!: string;
  public api!: string;
  public token!: string;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DeliveryPartner.init(
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
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'deliveryPartners',
    sequelize: database,
  },
);

DeliveryPartner.sync({ force: false }).then(() => console.log('DeliveryPartners table created'));

// DeliveryPartner Interface
export interface DeliveryPartnerInterface {
  name: string;
  logo: string;
  api: string;
  token: string;
  active: boolean;
}
