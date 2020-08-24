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


module.exports = router;
