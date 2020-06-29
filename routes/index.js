const express = require("express");
const users = require("./usersRouter");
const dishes = require("./dishesRouter");
const orders = require("./ordersRouter");
const app = express();
app.use("/users",users);
app.use("/dishes",dishes);
app.use("/orders",orders);
module.exports = app;