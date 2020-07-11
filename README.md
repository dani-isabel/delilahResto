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
(**roleId** is an optional parameter.

- It will be saved with id 1 if the property does not come in the request.
- Id **2** makes for **admin privileges** and id **1** is for a **normal client**).

### POST - Login of user

localhost:4000/users/login

```params
    {username} or {email}
    {password}
```

This endpoint responses a **token**. This token must be used in the **Authorization** with **Bearer Token** type for others endpoints (in users, products and orders) in **Postman**.

```js
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZUlkIjoxLCJpYXQiOjE1OTM5OTk2MzksImV4cCI6MTU5NDE3MjQzOX0.56790l9gC2FQsjH9uIwKWih7xmgRZA1dlVg4PaZKZic"
    }
```

_**Important note:** Example how to send in the **Authorization** the **Bearer Token** token in **Postman**._

![example postman Authorization](https://github.com/dani-isabel/delilahResto/blob/master/docs/exampleToken.png)

### GET - All users

localhost:4000/users

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.
Admin can see all users in the system.

### PUT - Users

localhost:4000/users/:id

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You must be login to update the information_.
- _You can't update your username and email because are used to the login_.

_**Important note:** The id is obtain with the **Token** information._

```js
    {
        "email": "alexrosso2@hotmail.com",
        "phone": 300289,
        "password": "12345",
        "address": "Calle Nunca Viva"
    }
```

### DELETE - Users

localhost:4000/users/:id

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.

_**Important note:** The id is obtain with the **Token** information._

## For managing dishes

### POST - Dishes

localhost:4000/dishes

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.

```js
    {
        "description": "dishName",
        "price": 10
    }
```

### GET - Dishes

localhost:4000/dishes

- _You need to send the token in the **Authorization** with **Bearer Token** key_.

### PUT - Dishes

localhost:4000/dishes/:id

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.

```js
    {
        "description": "dishName",
        "price": 10
    }
```

### DELETE - Dishes

localhost:4000/dishes/:id

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.

## For managing orders

## POST - Orders

localhost:4000/orders

- _You need to send the token in the **Authorization** with **Bearer Token** key_.

```js
    {
        "dishes": [
            {
                "id_dishes": 1,
            }
        ],
        "id_paymethod": 1,
    }
```

### GET - All orders

localhost:4000/orders

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.
Admin can see all orders.

### GET - Only client orders

localhost:4000/orders/myOrders

- _You need to send the token in the **Authorization** with **Bearer Token** key_.

Normal client only can see their orders.

### PUT - Orders (change status)

localhost:4000/orders/:id

This endpoint only update the order status.

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.

```js
    {
        "code_status": 2
    }
```

### DELETE - Orders

localhost:4000/orders/:id

- _You need to send the token in the **Authorization** with **Bearer Token** key_.
- _You need **admin privileges** via **roleId 2**. This is sent in the token_.

## Future improvements

- Include bcryptjs package (for encrypt password)
- Do the front end for the API
- Include an endpoint for logout sesion
- Make the connection with UI swagger using swagger-jsdoc and swagger-ui-express



