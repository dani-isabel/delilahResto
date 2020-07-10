const sequelize = require("sequelize");
const dataBase = require("../routes/sequelize");

const dishExist = (req,res,next) => {
    const id = req.query.id;
    const existDish = "SELECT * FROM dishes WHERE id = ?";
    dataBase.query(existDish, {replacements: [id], type: sequelize.QueryTypes.SELECT})
        .then(data => {
            if (!data.length) {
                return res.status(404).json({error: "Dish is not register"});
            }
            return next();
        }).catch(e => {
            return res.status(400).json({error: "Something went wrong..."}) 
        })
}
const dishRepeat = (req,res,next) => {
    const {dish} = req.body;
    const existDish = "SELECT * FROM dishes WHERE dish = ?";
    dataBase.query(existDish, {replacements: [dish], type: sequelize.QueryTypes.SELECT})
        .then(data => {
            if (!data.length) {
                return next();
            }
            return res.status(404).json({dish: "Dish is already register"});
        }).catch(e => {
            return res.status(400).json({error: "Something went wrong..."}) 
        })
}
module.exports = {dishExist,dishRepeat}