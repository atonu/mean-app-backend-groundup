const express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');


router.post('/register', (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.log('error', JSON.stringify(err, undefined, 2));
            res.send(JSON.stringify(err, undefined, 2));
        })
});

router.get('/getall', (req, res) => {
    User.find().then((users) => {
        res.send(users);
    }).catch((err) => {
        console.log('error', JSON.stringify(err, undefined, 2));
        res.send(JSON.stringify(err, undefined, 2))
    });
});

router.post('/login',(req,res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findByCredentials(email,password).then((user)=>{
        console.log(user);
        res.send(user);
    }).catch((err)=> {
        console.log(err);
    })
});


module.exports = router;
