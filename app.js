require('./config/config');
require('./models/db');
const express = require('express');
const bodyparser = require('body-parser');
var userController = require('./controllers/users.controller');


var app = new express();
app.use(bodyparser.json());
app.use('/auth', userController);


app.listen(process.env.PORT,(error)=>{
    if (!error){
        console.log('Listening to ' + process.env.PORT)
    } else {
        console.log('error', json.stringify(error,undefined,2));
    }
});
