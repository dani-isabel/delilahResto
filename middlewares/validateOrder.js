const sequelize = require("sequelize");
const dataBase = require("../routes/sequelize");

const insertNew = (req,res,next) => {
    const query = "INSERT INTO orders (code_status,id_paymethod) VALUES (1,?)";
    const {id_paymethod} = req.body;
    dataBase.query(query, {replacements: [id_paymethod]})
        .then((data) => {
            console.log(data[0]);
            const id_order = data[0];
            req.id_order = id_order;
            next();
        }).catch((e) => console.log(e));
}

const insertDishes = (req,res,next) => {
    const {dishes} = req.body;
    const {id_order} = req;
    for (i in dishes) {
        const query = "INSERT INTO orders_description (id_order,id_dishes) VALUES (?,?)";
        dataBase.query(query, {replacements: [id_order,dishes[i].id_dishes]})
        .then((data) => {
            console.log(data);
            next();
        }).catch((e) => console.log(e))
    }
}
module.exports = {insertDishes, insertNew}