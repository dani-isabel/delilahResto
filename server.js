const sequelize = require("sequelize");
const express = require("express");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");
const app = express();
app.use(express.json());
//CRUD users
//Get query users
app.get("/users", (req, res) => {
    const query = "SELECT * FROM users";
    dataBase.query(query, { type: sequelize.QueryTypes.SELECT })
        .then((users) => {
            res.json(users);
        })
        .catch((e) => console.log(e));
})
//Post query users
app.post("/users", (req, res) => {
    const query = "INSERT INTO users (id,username,email,name,phone,password,address) VALUES (?,?,?,?,?,?,?)";
    const { id, username, email, name, phone, password, address } = req.body;
    dataBase.query(query, { replacements: [id, username, email, name, phone, password, address] })
        .then((response) => {
            res.json({ status: "insertado", usuario: req.body });
        }).catch((e) => console.error(e));
})
//middleware exist
const userExist = (req, res, next) => {
    const username = req.query.username;
    const exist = "SELECT * FROM users WHERE username = ?";
    dataBase.query(exist, { replacements: [username], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            if (!data.length) {
                return res.status(404).json({ error: "User is not register" })
            }
            return next();
        }).catch(e => {
            return res.status(404).json({ error: "Something went wrong...",e })
        })
}
//Delete users
app.delete("/users",userExist, (req, res) => {
    const username = req.query.username;
    const query = "DELETE FROM users WHERE username = ?";
    dataBase.query(query, { replacements: [username] })
        .then ((data) => {
            res.json({status: "User delete"});
        }).catch(e => console.log("Something went wrong...",e));
});
app.listen(4000, (res, req) => console.log("Listening in the port 4000"));