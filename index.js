const express = require('express');
require('dotenv').config()

const database = require("./config/database")
database.connect()

const systemConfix = require("./config/system")

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static("public"))

//App locals Variables
app.locals.prefixAdmin = systemConfix.prefixAdmin

//Routes
route(app)
routeAdmin(app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});