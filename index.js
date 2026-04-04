const express = require('express');
const path = require("path")
require('dotenv').config()
const app = express();
const port = process.env.PORT;

const database = require("./config/database")
database.connect()

const systemConfix = require("./config/system")

const cookieParser = require("cookie-parser");
app.use(cookieParser("HuyHoangSecretKey")); 


const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");


app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static("public"))
app.use(express.json())

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//App locals Variables
app.locals.prefixAdmin = systemConfix.prefixAdmin

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

//Routes
route(app)
routeAdmin(app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});