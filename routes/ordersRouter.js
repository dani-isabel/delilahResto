const express = require("express");
const sequelize = require("sequelize");
const dataBase = require("./sequelize");
const orders = require("../middlewares/validateOrder");
const dishes = require("../middlewares/validateDish");
const middlewaresUser = require("../middlewares/validateUser");
const router = express.Router();

router.use(middlewaresUser.authenticateUser);
router.get("/", (req, res) => {
    const orders =
        "SELECT orders.*, status.state, users.name, users.address, dishes.price, group_concat(dishes.dish separator ','), as orders.dishes FROM orders JOIN status ON status.id = orders.code_status JOIN users ON users.id = orders.id_user JOIN orders.description ON dishes.id = orders.dishes";
    dataBase.query(orders, { type: sequelize.QueryTypes.SELECT })
        .then((data) => {
            res.json(data);
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