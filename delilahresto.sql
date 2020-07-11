use delilah;

CREATE TABLE IF NOT EXISTS  dishes (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dish varchar(60) NOT NULL,
  price int NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  rol char(20) NOT NULL
);

INSERT INTO roles (rol) VALUES
('client'),
('admin');

CREATE TABLE IF NOT EXISTS  users (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username char(20) NOT NULL,
  email varchar(60) NOT NULL,
  name varchar(60) NOT NULL,
  phone varchar(60) NOT NULL,
  password char(30) NOT NULL,
  address varchar(60) NOT NULL,
  code_rol int NOT NULL,
  FOREIGN KEY (code_rol) REFERENCES roles (id)
);

INSERT INTO users (username,email,name,phone,password,address,code_rol) VALUES
('rovalle','r.ovalle@outlook.com','Rodrigo Ovalle',3515056824,38506000,'683 Longview Avenue',2),
('santiinno','santi.innocenti@hotmail.com','Santiago Innocenti',3515215562,37732475,'398 Rardin Drive',1);

CREATE TABLE IF NOT EXISTS  pay_methods (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  method char(20) NOT NULL
);

INSERT INTO pay_methods (method) VALUES
('Credit'),
('Debit'),
('Cash'),
('PSE');

CREATE TABLE IF NOT EXISTS  status (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  state char(20) NOT NULL
);

INSERT INTO status (state) VALUES
('nuevo'),
('confirmado'),
('preparando'),
('enviando'),
('cancelado'),
('entregado');

CREATE TABLE IF NOT EXISTS orders (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  code_status int NOT NULL,
  hour time NOT NULL DEFAULT (curtime()),
  id_user int NOT NULL,
  id_paymethod int NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users (id),
  FOREIGN KEY (id_paymethod) REFERENCES pay_methods (id),
  FOREIGN KEY (code_status) REFERENCES status (id)
);

CREATE TABLE IF NOT EXISTS orders_description (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  id_order int NOT NULL,
  id_dishes int NOT NULL,
  FOREIGN KEY (id_order) REFERENCES orders (id)
) 
SELECT  status.state, orders.hour, orders.id, GROUP_CONCAT(dishes.dish SEPARATOR ', ') AS description, pay.method,SUM(dishes.price) AS total, users.name, users.address FROM orders orders JOIN status status ON orders.code_status = status.id JOIN users users ON orders.id_user= users.id JOIN pay_methods pay ON orders.id_paymethod = pay.id JOIN orders_description orders_description ON orders.id = orders_description.id_order JOIN dishes dishes ON orders_description.id_dishes = dishes.id GROUP BY orders.id;