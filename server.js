
const express = require("express");
const cors = require('cors');
const routes = require("./routes/index");
const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(4000, (res, req) => console.log("Listening in the port 4000"));
