const sequelize = require("sequelize");
const express = require("express");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");
const middlewares = require("../middlewares/validateDish");
const router = express.Router();

router.get("/", (req, res) => {
    const dishes = "SELECT * FROM dishes";
    dataBase.query(dishes, { type: sequelize.QueryTypes.SELECT })
        .then((dishes) => {
            res.json(dishes);
        }).catch((e) => console.log(e));
})
router.post("/", middlewares.dishRepeat, (req, res) => {
    const query = "INSERT INTO dishes (id,dish,price) VALUES (?,?,?)";
    const { id, dish, price } = req.body;
    dataBase.query(query, { replacements: [id, dish, price] })
        .then ((response) => {
            res.json({status: "Dish created", user: req.body });
        }). catch((e) => console.log(e));
})
router.delete("/", middlewares.dishExist, (req,res) => {
    const dish = req.query.dish;
    const query = "DELETE FROM dishes WHERE dish = ? ";
    dataBase.query(query, {replacements: [dish]})
        .then ((data) => {
            res.status(404).json({ status: "Dish delete"});
        }).catch(e => console.log("Something went wrong ...", (e)));
})
router.put("/", middlewares.dishExist, (req,res) => {
    const dish = req.query.dish;
    const query = "UPDATE dishes SET price = ? WHERE dish = ?";
    const {price} = req.body;
    dataBase.query(query, {replacements: [price,dish]})
    .then ((response) => {
        res.json({status: "Dish update successful"});
    }).catch((e) => console.error(e))
})
module.exports = router;