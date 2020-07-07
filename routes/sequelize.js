const sequelize = require("sequelize");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilah", {timezone: '-05:00'});
module.exports = dataBase