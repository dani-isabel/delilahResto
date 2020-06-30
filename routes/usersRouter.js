const sequelize = require("sequelize");
const express = require("express");
const middlewares = require("../middlewares/validateUser");
const jwt = require("jsonwebtoken");
const information = { name: "Delilah" };
const signature = "password_extra_secret";
const token = jwt.sign(information, signature);
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");
const router = express.Router();

router.get("/", (req, res) => {
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
                res.json({token});
            }
        }).catch(e => {
            return res.status(400).json({ error: "User or password invalid"})
        })
})
router.post("/", (req, res) => {
    const query = "INSERT INTO users (code_rol,username,email,name,phone,password,address) VALUES (1,?,?,?,?,?,?)";
    const { username, email, name, phone, password, address } = req.body;
    dataBase.query(query, { replacements: [username, email, name, phone, password, address] })
        .then((response) => {
            res.json({ status: "User created", user: req.body });
        }).catch((e) => console.error(e));
})
router.put("/",middlewares.userExist, (req, res) => {
    const username = req.query.username;
    const query = "UPDATE users SET email = ?,phone = ?,password = ?,address = ? WHERE username = ?";
    const { email, phone, password, address } = req.body;
    dataBase.query(query, { replacements: [email, phone, password, address, username] })
        .then((response) => {
            res.json({ status: "User updated successful" });
        }).catch((e) => console.error(e));
})
router.delete("/", (req, res) => {
    const username = req.query.username;
    const query = "DELETE FROM users WHERE username = ?";
    dataBase.query(query, { replacements: [username] })
        .then((data) => {
            res.json({ status: "User delete" });
        }).catch(e => console.log("Something went wrong...", e));
});
module.exports = router;