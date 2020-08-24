require('./models/db');
const express = require('express');
const bodyparser = require('body-parser');


var app = new express();
app.use(bodyparser.json());
app.listen(3000,(error)=>{
    if (!error){
        console.log('Listening to 3000')
    } else {
        console.log('error', json.stringify(error,undefined,2));
    }
});
