const sequelize = require("sequelize");
const express = require("express");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");
const app = express();
app.use(express.json());
//CRUD users
app.get("/users",(req,res) => {
    const query = "SELECT * FROM users";
    dataBase.query(query, {type:sequelize.QueryTypes.SELECT})
        .then((users) => {
            res.json(users);
        })
        .catch((e) => console.log(e));
})
app.listen(4000, (res,req) => console.log("Escuchando por el puerto 4000"));