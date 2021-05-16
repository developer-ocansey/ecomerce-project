import { Sequelize } from 'sequelize';

export const database = new Sequelize({
  database: 'database',
  //database: 'bcd_backend',
  host: 'host',
  //host: 'localhost',
  dialect: 'mysql',
  username: 'username',
  password: 'password',
  //password: 'root',
    pool:  {
      max: 50,
      min: 0,
      acquire: 1200000,
      idle: 1000000,
    }
});
