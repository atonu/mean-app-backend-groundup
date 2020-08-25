const express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');

/*REGISTRATION*/
router.post('/register', (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(() => {
        return user.createSession();
    }).then((refreshToken) => {
        res.send(refreshToken);
    })
        .catch((err) => {
            console.log('errorz', JSON.stringify(err, undefined, 2));
            res.send(JSON.stringify(err, undefined, 2));
        })
});

/*Get-ALL-USERS*/
router.get('/getall', (req, res) => {
    User.find().then((users) => {
        res.send(users);
    }).catch((err) => {
        console.log('error', JSON.stringify(err, undefined, 2));
        res.send(JSON.stringify(err, undefined, 2))
    });
});

/*LOGIN*/
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findByCredentials(email, password).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.send(err);
        console.log(err);
    })
});


module.exports = router;
