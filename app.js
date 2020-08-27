require('./config/config');
require('./models/db');
const express = require('express');
const bodyparser = require('body-parser');
let userController = require('./controllers/users.controller');
let employeeController = require('./controllers/employeeController');
// let cors = require('cors');

var app = new express();
app.use(bodyparser.json());
app.use('/auth', userController);
app.use('/employees', employeeController);
// app.use(cors({origin: process.env.ORIGIN}));

app.listen(process.env.PORT, (error) => {
    if (!error) {
        console.log('Listening to ' + process.env.PORT)
    } else {
        console.log('error', json.stringify(error, undefined, 2));
    }
});
