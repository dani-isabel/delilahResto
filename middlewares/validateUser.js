const sequelize = require("sequelize");
const dataBase = new sequelize("mysql://root:@localhost:3306/delilahresto");

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
            return res.status(404).json({ error: "User not found", e })
        })
};
const authenticateUser = (req,res,next) => {
    try {
            const loginToken = req.headers.authorization.split(" ")[1];
            const tokenVerification = jwt.verify(loginToken,signature);
            if(tokenVerification) {
                req.query.username = tokenVerification;
                return next();
            }
        } catch(e) {
            res.status(400).json({ error: "User or password invalid"})
        }
     };
module.exports = {userExist,authenticateUser}