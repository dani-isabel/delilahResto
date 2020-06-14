const sequelize = require("sequelize");
const express = require("express");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");
const app = express();
app.use(express.json());
//CRUD users
//Get query users
app.get("/users",(req,res) => {
    const query = "SELECT * FROM users";
    dataBase.query(query, {type:sequelize.QueryTypes.SELECT})
        .then((users) => {
            res.json(users);
        })
        .catch((e) => console.log(e));
})
//Post query users
app.post("/users",(req,res) => {
    const query = "INSERT INTO users (id,username,email,name,phone,password,address) VALUES (?,?,?,?,?,?,?)";
    const {id,username,email,name,phone,password,address} = req.body;
    dataBase.query(query, {replacements: [id,username,email,name,phone,password,address]})
    .then((response) => {
        res.json({status:"insertado",usuario:req.body});
    }).catch((e) => console.error(e));
})
//middleware exist
const userExist = (req,res,next) => {
    const name = res.query.name;
    const exist = "SELECT * FROM users WHERE name = ?";
    dataBase.query(exist, {replacements: [name],type:sequelize.QueryTypes.SELECT})
    .then(data => {
        if(!data.legth) {
            return res.status(404).json({error: "Usuario no registrado"})
        }
        return next();
    }).catch(e => {
        return res.status(404).json({error: "Algo salio mal..."})
    })
}
app.listen(4000, (res,req) => console.log("Escuchando por el puerto 4000"));