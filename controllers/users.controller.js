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
        return user.generateAccessToken().then((accessToken) => {
            return ({refreshToken, accessToken});
        }).catch((err) => {
            res.send(JSON.stringify(err, undefined, 2));
        });
    }).then((authToken) => {
        res
            .header('x-access-token', authToken.accessToken)
            .header('x-refresh-token', authToken.refreshToken)
            .send(user);
    })
        .catch((err) => {
            console.log('error', JSON.stringify(err, undefined, 2));
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
        return user.createSession().then((refreshToken) => {
            return user.generateAccessToken().then((accessToken) => {
                return {refreshToken, accessToken};
            });
        }).then((authToken) => {
            res
                .header("x-refresh-token", authToken.refreshToken)
                .header("x-access-token", authToken.accessToken)
                .send(user);
        })
    }).catch((err) => {
        res.send(err);
        console.log(err);
    })
});


module.exports = router;
