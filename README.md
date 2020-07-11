# REST API Delilah Resto

**A REST API to provide delivery food services, managing CRUD products and orders usign Node JS, Mysql, Swagger and Javascript**

## Tecnologies and packages used for development

- Node JS
- Express
- MySQL
- cors (enable requests from other domains)
- JSON Web Token (JWT)
- Sequelize
- Nodemon (automatic initialization)

# Getting Started

This README.md will guide you on how to install and use this API.

NOTE: You can find the specification of the **OpenAPI** in [Open API Docs](https://app.swaggerhub.com/apis/dani-isabel/Delilahresto/1.0.0).

## Installation and initialization

### Clone the repository or download the zip:

```bash
$ git clone https://github.com/dani-isabel/delilahResto.git
```
## To install the dependencies

Use **npm** or **yarn** to install the dependencies.

```bash
$ npm install
```

```bash
$ yarn install
```

## Dependencies used

```json
"dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mysql2": "^2.1.0",
    "nodemon": "^2.0.4",
    "sequelize": "^5.21.12"
  }
```
## Configure the database

### Create database

Open a new query in mysql and execute:

```bash
CREATE DATABASE IF NOT EXISTS delilah
```

Open file [sequelize.js](https://github.com/dani-isabel/delilahResto/blob/master/routes/sequelize.js). In this file you will find the constant dataBase. Edit this root (mysql://user:password@host:port/database) acording with your information:
    - user: User for conection (root is default when you're using XAMPP)
    - password: Assign password (without password is default when you're using XAMPP)
    - host: Domain or IP where is running MySQL
    - por: Port where is listening MySQL
    - database: Name of the database (for this repository is delilah)

Tables and associations will generate automatically after initializing server.

## Initialize the server

```bash
cd server
npm start
```

This will install the app in port **4000**. You can edit the port in the file [server.js](https://github.com/dani-isabel/delilahResto/blob/master/server.js).

If everything is ok you will get the next message:

- _"Listening in the port 4000"_

**Important note:** Tables and associations were created after did this.
You can see the model database [here](https://github.com/dani-isabel/delilahResto/blob/master/docs/dataModel.pdf).

Execute the next script [delilahresto.sql](https://github.com/dani-isabel/delilahResto/blob/master/delilahresto.sql) in MySQL to insert data in roles, dishes, pay_methods, status, orders, orders_description and users tables.

You can check this in the mysql tables.

**Important note:** This information needs to be inserted before testing all endpoints. **This is a master data.**
This script can be only executes one time. 

## Testing the API

Use **Postman** or similar apps to try out the CRUD (create, read, update and delete) requests.

**You can [Run in Postman](https://www.getpostman.com/collections/b477bfef05e953d5d07e). (For adding the collection in your windows postman. This contains all endpoints and data body to test/run each endpoint). This will save you work for testing.**

## METHODS

**Important note:** Middlewares check user and admin with a token. To have access to resources with admin privileges, you need to be logged in as a registered admin first. Also there are middlewares to check the existence of some important atributes like: user, dish and order

**Other important note:** Please remember to use JSON for all "body: raw" requests.

## ENDPOINTS

(If you changed the PORT variable in sequelize.js please change it in all endpoints).

## For managing users

### POST - Register a user

http://localhost:4000/users

Request body:

```js
    {
        "username": "myUsername",
        "email": "myEmail.com",
        "name": "myFullName",
        "phone":  123456,
        "password": "myPassword",
        "address": "myShippingAdress"
        "rol": 2
}
```



