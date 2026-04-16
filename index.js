
const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const database = require('./config/database');
const systemConfig = require('./config/system');
require('./config/passport'); // Cấu hình logic Passport

// Require Routes
const routeAdmin = require('./routes/admin/index.route');
const routeClient = require('./routes/client/index.route');

// Require Custom Middlewares
const settingMiddleware = require('./middlewares/client/setting.middleware');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 3000;

database.connect();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.locals.prefixAdmin = systemConfig.prefixAdmin; // Biến toàn cục cho file Pug

app.use(express.static(`${__dirname}/public`));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("HuyHoangSecretKey")); 

app.use(passport.initialize());

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use(settingMiddleware.settingGeneral);
app.use(methodOverride('_method'));


routeAdmin(app);
routeClient(app);


app.listen(port, () => {
    console.log(`Hệ thống đang chạy tại cổng ${port}`);
});