const sequelize = require("sequelize");
const express = require("express");
const dataBase = require("./sequelize");
const middlewares = require("../middlewares/validateDish");
const middlewaresUser = require("../middlewares/validateUser");
const router = express.Router();

router.use(middlewaresUser.authenticateUser);
router.get("/", (req, res) => {
    const dishes = "SELECT * FROM dishes";
    dataBase.query(dishes, { type: sequelize.QueryTypes.SELECT })
        .then((dishes) => {
            res.json(dishes);
        }).catch((e) => console.log(e));
})
router.post("/", middlewaresUser.authenticateAdmin,middlewares.dishRepeat, (req, res) => {
    const query = "INSERT INTO dishes (dish,price) VALUES (?,?)";
    const { dish, price } = req.body;
    dataBase.query(query, { replacements: [dish, price] })
        .then ((response) => {
            res.json({status: "Dish created", user: req.body });
        }). catch((e) => console.log(e));
})
router.delete("/",middlewaresUser.authenticateAdmin, middlewares.dishExist, (req,res) => {
    const id = req.query.id;
    const query = "DELETE FROM dishes WHERE id = ? ";
    dataBase.query(query, {replacements: [id]})
        .then ((data) => {
            res.status(404).json({ status: "Dish delete"});
        }).catch(e => console.log("Something went wrong ...", (e)));
})
router.put("/",middlewaresUser.authenticateAdmin, middlewares.dishExist, (req,res) => {
    const id = req.query.id;
    const query = "UPDATE dishes SET dish = ?, price = ? WHERE id = ?";
    const {dish,price} = req.body;
    dataBase.query(query, {replacements: [dish,price,id]})
    .then ((response) => {
        res.json({status: "Dish update successful"});
    }).catch((e) => console.error(e))
})
module.exports = router;