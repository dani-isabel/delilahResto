const sequelize = require("sequelize");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");

const dishExist = (req,res,next) => {
    const dish = req.query.dish;
    const existDish = "SELECT * FROM dishes WHERE dish = ?";
    dataBase.query(existDish, {replacements: [dish], type: sequelize.QueryTypes.SELECT})
        .then(data => {
            if (!data.length) {
                return res.status(404).json({dish: "Dish is not register"});
            }
            return next();
        }).catch(e => {
            return res.status(404).json({error: "Something went wrong..."}) 
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
            return res.status(200).json({dish: "Dish is already register"});
        }).catch(e => {
            return res.status(404).json({error: "Something went wrong..."}) 
        })
}
module.exports = {dishExist,dishRepeat}