const express = require('express');
require('dotenv').config()

const database = require("./config/database")
database.connect()

const systemConfix = require("./config/system")

const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static("public"))
app.use(express.json())

//App locals Variables
app.locals.prefixAdmin = systemConfix.prefixAdmin

// Flash message
app.use(cookieParser('HuyHoangSecretKey')); 
app.use(session({ cookie: { maxAge: 60000 }})); 
app.use(flash());

//Routes
route(app)
routeAdmin(app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});