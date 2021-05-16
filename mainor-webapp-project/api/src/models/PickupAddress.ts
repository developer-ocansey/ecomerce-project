import { DataTypes, Model, Sequelize } from 'sequelize';

import { database } from '../config/database';

export class PickupAddress extends Model {
  name!: string;
  contactName!: string;
  fullAddress!: string;
  contactNumber!: string;
  deliveryTime!: number;
  pickupTime!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize Model
PickupAddress.init(
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
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryTime: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    pickupTime: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'PickupAddresss',
    sequelize: database,
  },
);

PickupAddress.sync({ force: false }).then(() => console.log('PickupAddresss table created'));
// PickupAddress Interface
export interface PickupAddressInterface {
    name: string;
    contactName: string;
    fullAddress: string;
    contactNumber: string;
    deliveryTime: number;
    pickupTime: number;
}