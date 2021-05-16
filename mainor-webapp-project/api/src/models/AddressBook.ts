import { DataTypes, Model, Sequelize } from 'sequelize';

import { Product } from './Product';
import { database } from '../config/database';

export class AddressBook extends Model {
  public customerId!: number;
  public firstName!: string;
  public lastName!: string;
  public phoneNumber!: string;
  public region!: string;
  public state!: string;
  public city!: string;
  public address!: string;
  public default!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AddressBook.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    default: {
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
    tableName: 'addressBooks',
    sequelize: database,
  },
);

AddressBook.sync({ force: false }).then(() => console.log('AddressBooks table created'));

// AddressBook Interface
export interface AddressBookInterface {
  customerId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  region: string;
  state: string;
  city: string;
  address: string;
  default: boolean;
}