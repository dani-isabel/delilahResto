const express = require("express");
const sequelize = require("sequelize");
const middlewares = require("../middlewares/validateUser");
const jwt = require("jsonwebtoken");
const signature = "password_extra_secret";
const dataBase = require("./sequelize");
const router = express.Router();

router.get("/", middlewares.authenticateUser,middlewares.authenticateAdmin,(req, res) => {
    const query = "SELECT users.*, roles.rol FROM users JOIN roles ON roles.id = users.code_rol";
    dataBase.query(query, { type: sequelize.QueryTypes.SELECT })
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((e) => console.log(e));
})
router.post("/login",(req, res) => {
    const email = req.query.email;
    const username = req.query.username;
    const password = req.query.password;
    const exist = "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?";
    dataBase.query(exist, { replacements: [username,email,password], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            console.log(data);
            if (data[0].username == username || data[0].email == email && data[0].password == password) {
                const rol = data[0].code_rol;
                const id = data[0].id;
                const playload = {id,username,email,rol};
                const token = jwt.sign(playload, signature,{expiresIn:1440});
                res.json(token);
        }}).catch(e => {
            return res.status(400).json({ error: "User or password invalid"})
        })
})
router.post("/",middlewares.userRepeat, (req, res) => {
    const query = "INSERT INTO users (code_rol,username,email,name,phone,password,address) VALUES (1,?,?,?,?,?,?)";
    const { username, email, name, phone, password, address } = req.body;
    dataBase.query(query, { replacements: [username, email, name, phone, password, address] })
        .then((response) => {
            res.json({ status: "User created", user: req.body });
        }).catch((e) => console.error(e));
})
router.put("/", middlewares.authenticateUser,middlewares.userExist, (req, res) => {
    const {username} = req;
    const {email} = req;
    const query = "UPDATE users SET phone = ?,password = ?,address = ? WHERE username = ? OR email = ?";
    const { phone, password, address } = req.body;
    dataBase.query(query, { replacements: [phone, password, address, username, email] })
        .then((response) => {
            res.json({ status: "User updated successful" });
        }).catch((e) => console.error(e));
})
router.delete("/",middlewares.authenticateUser,middlewares.authenticateAdmin,middlewares.userExist, (req, res) => {
    const {username} = req;
    const {email} = req;
    const query = "DELETE FROM users WHERE username = ? OR email = ?";
    dataBase.query(query, { replacements: [username,email] })
        .then(() => {
            res.status(200).res.json({ status: "User delete" });
        }).catch(e => console.log("Something went wrong...", e));
});
module.exports = router;