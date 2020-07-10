const express = require("express");
const sequelize = require("sequelize");
const dataBase = require("./sequelize");
const orders = require("../middlewares/validateOrder");
const middlewaresUser = require("../middlewares/validateUser");
const router = express.Router();

router.use(middlewaresUser.authenticateUser,);
router.get("/",middlewaresUser.authenticateAdmin,(req, res) => {
    const orders =
    "SELECT  status.state, orders.hour, orders.id, GROUP_CONCAT(dishes.dish SEPARATOR ', ') AS description, pay.method,SUM(dishes.price) AS total, users.name, users.address FROM orders orders JOIN status status ON orders.code_status = status.id JOIN users users ON orders.id_user= users.id JOIN pay_methods pay ON orders.id_paymethod = pay.id JOIN orders_description orders_description ON orders.id = orders_description.id_order JOIN dishes dishes ON orders_description.id_dishes = dishes.id GROUP BY orders.id";
    dataBase.query(orders, { type: sequelize.QueryTypes.SELECT })
        .then((data) => {
            res.json(data);
        }).catch((e) => console.log(e));
})
router.get("/myOrders",(req, res) => {
    const {id,rol} = req;
    if(rol === 2){
        res.redirect('/orders/')
    }
    const orders =
    "SELECT  status.state, orders.hour, orders.id, GROUP_CONCAT(dishes.dish SEPARATOR ', ') AS description, pay.method,SUM(dishes.price) AS total, users.name, users.address FROM orders orders JOIN status status ON orders.code_status = status.id JOIN users users ON orders.id_user= users.id JOIN pay_methods pay ON orders.id_paymethod = pay.id JOIN orders_description orders_description ON orders.id = orders_description.id_order JOIN dishes dishes ON orders_description.id_dishes = dishes.id WHERE users.id = ? GROUP BY orders.id";
    dataBase.query(orders, {replacements: [id]})
        .then((data) => {
            res.json(data[0]);
        }).catch((e) => console.log(e));
})
router.post("/", orders.validatePaymethod, orders.insertNew, orders.insertDishes, (req, res) => {
    res.json({ status: "Order created", order: req.body });
})
router.put("/",middlewaresUser.authenticateAdmin,orders.orderExist,orders.validateStatus, (req, res) => {
    const id = req.query.id;
    const query = "UPDATE orders SET code_status = ? WHERE id = ?";
    const { code_status } = req.body;
    dataBase.query(query, { replacements: [code_status, id] })
        .then((data) => {
            res.json({ status: "Order status update successful" });
        }).catch((e) => console.log(e));
})
router.delete("/",middlewaresUser.authenticateAdmin,orders.orderExist, (req, res) => {
    const id = req.query.id;
    const query = "DELETE FROM orders WHERE id = ?";
    dataBase.query(query, { replacements: [id] })
        .then((data) => {
            res.status(404).json({ status: "Order deleted" });
        }).catch(e => console.log("Something went wrong ...", (e)));
})
module.exports = router