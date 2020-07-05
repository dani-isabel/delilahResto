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
const orderExist = (req, res, next) => {
    const id = req.query.id;
    const exist = "SELECT * FROM orders WHERE id = ? ";
    dataBase.query(exist, { replacements: [id], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            if (!data.length) {
                return res.status(404).json({ error: "Order doesn't already exist" })
            }
            return next();
        }).catch(e => {
            return res.status(500).json({ error: "Something went wrong...", e })
        })
};
const validateStatus = (req, res, next) => {
    const { code_status } = req.body;
            if (code_status > 0 && code_status <= 4) {
                return next();
            }
            return res.status(404).json({ error: "This status doesn't exist"})
};
const validatePaymethod = (req, res, next) => {
    const { id_paymethod } = req.body;
            if (id_paymethod > 0 && id_paymethod <= 4) {
                return next();
            }
            return res.status(404).json({ error: "This pay method doesn't exist"})
};
module.exports = {insertDishes, insertNew, orderExist,validateStatus,validatePaymethod}