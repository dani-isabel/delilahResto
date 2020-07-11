const sequelize = require("sequelize");
const dataBase = new sequelize("mysql://root:12345@localhost:3306/delilah", {timezone: '-05:00'});
module.exports = dataBase