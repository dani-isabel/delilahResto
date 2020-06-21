const sequelize = require("sequelize");
const express = require("express");
const jwt = require("jsonwebtoken");
const information = {name: "Delilah"};
const signature = "password_extra_secret";
const token = jwt.sign(information,signature);
console.log(token);
const decode = jwt.verify(token,signature);
console.log(decode);
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");
const app = express();
app.use(express.json());
//Validate user and password 
const validateUser = (req, res, next) => {
    const {username,password} = req.body;
    const exist = "SELECT * FROM users WHERE username = ? AND password = ?";
    dataBase.query(exist, { replacements: [username,password], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            console.log(data);
            if (data[0].username == username && data[0].password == password) {
                return next();
            }
        }).catch(e => {
            return res.status(404).json({ error: "User or password invalid"})
        })
}
//Login users
app.post("/login", validateUser, (req,res) => {
    res.json({token});
})
//Middleware authentication users
const authenticateUser = (req,res,next) => {
    try {
            const loginToken = req.headers.authorization.split(" ")[1];
            const tokenVerification = jwt.verify(loginToken,signature);
            if(tokenVerification) {
                req.query.username = tokenVerification;
                return next();
            }
        } catch(e) {
            res.json({ error: "User or password invalid"})
        }
     };
//Users authentication
app.post("/secure",authenticateUser,(req,res) => {
    res.send(`This is an authenticate webpage. Welcome ${req.query.username}`)
})
//CRUD users
//Get query users
app.get("/users", (req, res) => {
    const query = "SELECT users.*, roles.rol FROM users JOIN roles ON roles.id = users.code_rol";
    dataBase.query(query, { type: sequelize.QueryTypes.SELECT })
        .then((users) => {
            res.json(users);
        })
        .catch((e) => console.log(e));
})
//Post query users
app.post("/users", (req, res) => {
    const query = "INSERT INTO users (id,code_rol,username,email,name,phone,password,address) VALUES (?,?,?,?,?,?,?,?)";
    const { id,code_rol,username, email, name, phone, password, address } = req.body;
    dataBase.query(query, { replacements: [id, code_rol, username, email, name, phone, password, address] })
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
app.delete("/users",userExist, (req, res) => {
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
    const query = "INSERT INTO dishes (id,dish,price) VALUES (?,?,?)";
    const { id, dish, price } = req.body;
    dataBase.query(query, { replacements: [id, dish, price] })
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
    const query = "UPDATE dishes SET dish = ?, price = ? WHERE id = ?";
    const {dish,price} = req.body;
    dataBase.query(query, {replacements: [dish,price,id]})
    .then ((response) => {
        res.json({status: "Dish update successful"});
    }).catch((e) => console.error(e))
})
//Get orders 
app.get("/orders", (req,res) => {
    const orders = 
    "SELECT orders.*, status.state, users.name, users.address, dishes.dish, dishes.price FROM orders JOIN status ON status.id = orders.code_status JOIN users ON users.id = orders.id_user JOIN dishes ON dishes.id = orders.dishes";
    dataBase.query(orders, {type: sequelize.QueryTypes.SELECT})
        .then((data) => {
            res.json(data);
        }).catch((e) => console.log(e));
})
//Create new orders
app.post("/orders",userExist, (req,res) => {
    const query = "INSERT INTO orders (id,code_status,hour,dishes,total,id_user) VALUES (?,?,?,?,?,?)";
    const {id,code_status,hour,dishes,total,id_user} = req.body;
    dataBase.query(query, {replacements: [id,code_status,hour,dishes,total,id_user]})
        .then((data) => {
            res.json({status: "Order created", order:req.body});
        }).catch((e) => console.log(e));
})
//Actualize status of existing orders ---> ADMIN <---
app.put("/orders",(req,res) => {
    const id = req.query.id;
    const query = "UPDATE orders SET code_status = ? WHERE id = ?";
    const {code_status} = req.body;
    dataBase.query(query, {replacements: [code_status,id]})
    .then((data) => {
        res.json({status: "Order status update successful"});
    }).catch((e) => console.log(e));
})
//Delete existing order ---> Admin <---
app.delete("/orders", (req,res) => {
    const id = req.query.id;
    const query = "DELETE FROM orders WHERE id = ?";
    dataBase.query(query, {replacements: [id]})
        .then((data) => {
            res.status(404).json({status:"Order deleted"});
        }).catch(e => console.log("Something went wrong ...",(e)));
})
app.listen(4000, (res, req) => console.log("Listening in the port 4000"));
