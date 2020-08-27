require('./config/config');
require('./models/db');
const express = require('express');
const bodyparser = require('body-parser');
let userController = require('./controllers/users.controller');
let employeeController = require('./controllers/employeeController');
let cors = require('cors');

var app = new express();
app.use(bodyparser.json());
app.use('/auth', userController);
app.use('/employees', employeeController);
app.use(cors({origin: process.env.ORIGIN}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS");
    res.header("Access-Control-Allow-Headers", "x-refresh-token, x-access-token");
    res.header("Access-Control-Expose-Headers", "x-refresh-token, x-access-token");
    next();
});
app.listen(process.env.PORT, (error) => {
    if (!error) {
        console.log('Listening to ' + process.env.PORT)
    } else {
        console.log('error', json.stringify(error, undefined, 2));
    }
});
