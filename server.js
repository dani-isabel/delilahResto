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
            res.json({ status: "User created", user: req.body });
        }).catch((e) => console.error(e));
})
//Middleware exist user
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
            return res.status(404).json({ error: "Something went wrong...", e })
        })
}
//Delete users
app.delete("/users", userExist, (req, res) => {
    const username = req.query.username;
    const query = "DELETE FROM users WHERE username = ?";
    dataBase.query(query, { replacements: [username] })
        .then((data) => {
            res.json({ status: "User delete" });
        }).catch(e => console.log("Something went wrong...", e));
});
//Put new existing users info
app.put("/users", userExist, (req, res) => {
    const username = req.query.username;
    const query = "UPDATE users SET email = ?,phone = ?,password = ?,address = ? WHERE username = ?";
    const { email, phone, password, address } = req.body;
    dataBase.query(query, { replacements: [email, phone, password, address, username] })
        .then((response) => {
            res.json({ status: "User updated successful" });
        }).catch((e) => console.error(e));
})
//Get dishes
app.get("/dishes", (req, res) => {
    const dishes = "SELECT * FROM dishes";
    dataBase.query(dishes, { type: sequelize.QueryTypes.SELECT })
        .then((dishes) => {
            res.json(dishes);
        }).catch((e) => console.log(e));
})
//Post new dishes
app.post("/dishes", (req, res) => {
    const query = "INSERT INTO dishes (id,name,price) VALUES (?,?,?)";
    const { id, name, price } = req.body;
    dataBase.query(query, { replacements: [id, name, price] })
        .then ((response) => {
            res.json({status: "Dish created", user: req.body });
        }). catch((e) => console.log(e));
})
//Middleware exist dish
const dishExist = (req,res,next) => {
    const id = req.query.id;
    const existDish = "SELECT * FROM dishes WHERE id = ?";
    dataBase.query(existDish, {replacements: [id], type: sequelize.QueryTypes.SELECT})
        .then(data => {
            if (!data.length) {
                return res.status(404).json({dish: "Dish is not register"});
            }
            return next();
        }).catch(e => {
            return res.status(404).json({error: "Something went wrong..."}) 
        })
}
//Delete dish
app.delete("/dishes",dishExist, (req,res) => {
    const id = req.query.id;
    const query = "DELETE FROM dishes WHERE id = ? ";
    dataBase.query(query, {replacements: [id]})
        .then ((data) => {
            res.status(404).json({ status: "Dish delete"});
        }).catch(e => console.log("Something went wrong ...", (e)));
})
//Edit existing dishes
app.put("/dishes", dishExist, (req,res) => {
    const id = req.query.id;
    const query = "UPDATE dishes SET name = ?, price = ? WHERE id = ?";
    const {name,price} = req.body;
    dataBase.query(query, {replacements: [name,price,id]})
    .then ((response) => {
        res.json({status: "Dish update successful"});
    }).catch((e) => console.error(e))
})
app.listen(4000, (res, req) => console.log("Listening in the port 4000"));