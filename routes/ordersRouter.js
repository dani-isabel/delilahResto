const sequelize = require("sequelize");
const express = require("express");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");
const middlewares = require("../middlewares/validateOrder");
const router = express.Router();

router.get("/", (req,res) => {
    const orders = 
    "SELECT orders.*, status.state, users.name, users.address, dishes.dish, dishes.price FROM orders JOIN status ON status.id = orders.code_status JOIN users ON users.id = orders.id_user JOIN dishes ON dishes.id = orders.dishes";
    dataBase.query(orders, {type: sequelize.QueryTypes.SELECT})
        .then((data) => {
            res.json(data);
        }).catch((e) => console.log(e));
})
router.post("/", (req,res) => {
    const query = "INSERT INTO orders (code_status,hour,dishes,total,id_user) VALUES (1,?,?,?,?)";
    const {hour,dishes,total,id_user} = req.body;
    dataBase.query(query, {replacements: [hour,dishes,total,id_user]})
        .then((data) => {
            res.json({status: "Order created", order:req.body});
        }).catch((e) => console.log(e));
})
router.put("/",(req,res) => {
    const id = req.query.id;
    const query = "UPDATE orders SET code_status = ? WHERE id = ?";
    const {code_status} = req.body;
    dataBase.query(query, {replacements: [code_status,id]})
    .then((data) => {
        res.json({status: "Order status update successful"});
    }).catch((e) => console.log(e));
})
router.delete("/", (req,res) => {
    const id = req.query.id;
    const query = "DELETE FROM orders WHERE id = ?";
    dataBase.query(query, {replacements: [id]})
        .then((data) => {
            res.status(404).json({status:"Order deleted"});
        }).catch(e => console.log("Something went wrong ...",(e)));
})
module.exports = router