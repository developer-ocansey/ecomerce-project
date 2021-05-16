"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const sequelize_1 = require("sequelize");
exports.database = new sequelize_1.Sequelize({
    database: 'database',
    //database: 'bcd_backend',
    host: 'host',
    //host: 'localhost',
    dialect: 'mysql',
    username: 'username',
    password: 'password',
    //password: 'root',
    pool: {
        max: 50,
        min: 0,
        acquire: 1200000,
        idle: 1000000,
    }
});
