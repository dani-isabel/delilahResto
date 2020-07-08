const sequelize = require("sequelize");
const dataBase = require("../routes/sequelize");
const jwt = require("jsonwebtoken");
const signature = "password_extra_secret";

const userExist = (req, res, next) => {
    const {username} = req;
    const {email} = req;
    const exist = "SELECT * FROM users WHERE username = ? OR email = ?";
    dataBase.query(exist, { replacements: [username,email], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            if (!data.length) {
                return res.status(404).json({ error: "User is not register" })
            }
            return next();
        }).catch(e => {
            return res.status(404).json({ error: "User not found", e })
        })
};
const userRepeat = (req, res, next) => {
    const {username} = req.body;
    const exist = "SELECT * FROM users WHERE username = ? ";
    dataBase.query(exist, { replacements: [username], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            if (data.length) {
                return res.status(404).json({ error: "Username is not available" })
            }
            return next();
        }).catch(e => {
            return res.status(400).json({ error: "Something went wrong..." })
        })
};
const authenticateUser = (req,res,next) => {
    const loginToken = req.headers.authorization.split(" ")[1];
    try{
        var token = jwt.verify(loginToken,signature);
    }catch(err){
        res.status(401).json({ error: "Token expired. Login again"})
    }
    
    try {
            if(token) {
                const username = token.username;
                const email = token.email;
                const rol = token.rol;
                const id = token.id;
                req.username = username;
                req.email = email;
                req.rol = rol;
                req.id = id;
                return next();
            }
        } catch(e) {
            res.status(400).json({ error: "User or password invalid"})
        }
     };
const authenticateAdmin = (req,res,next) => {
    const {rol} = req;
    try {
        if(rol == 2) {
            return next();
        }
        return res.status(401).json({ error: "You don't have permissions"})
    }catch(e) {
        return res.status(400).json({ error: "Something went wrong..."})
    }
};
module.exports = {userExist,authenticateUser,authenticateAdmin, userRepeat}