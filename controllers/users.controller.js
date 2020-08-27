const express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cors = require('cors');


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
});


/*MIDDLEWARE*/
let authenticate = function (req, res, next) {
    let token = req.header("x-access-token");
    jwt.verify(token, User.getSecretKey(), (err, decoded) => {
        if (err) {
            res.status(401)
                .send(err);
        } else {
            req.user_id = decoded._id;
            next();
        }
    });
};

let verifySession = function (req, res, next) {
    let _id = req.header('_id');
    let refreshToken = req.header('x-refresh-token');
    let sessionValid = false;
    User.findUserByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                error: 'User not found'
            });
        }
        req.userObject = user;
        req.user_id = user._id;
        req.refreshToken = refreshToken;
        user.sessions.forEach(session => {
            if (session.token === refreshToken) {
                if (session.expiresAt > Date.now() / 100) {
                    sessionValid = true;
                }
            }
        });
        if (!sessionValid) {
            return Promise.reject({
                error: 'Refresh token expired'
            });
        } else {
            next();
        }
    }).catch((err) => {
        res
            .status(401).send(err);
    })

};

/*REGISTRATION*/
router.post('/register',cors(), (req, res) => {
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
router.get('/getall',cors(), authenticate, (req, res) => {
    User.find().then((users) => {
        res.send(users);
    }).catch((err) => {
        console.log('error', JSON.stringify(err, undefined, 2));
        res.send(JSON.stringify(err, undefined, 2))
    });
});

/*LOGIN*/
router.post('/login', cors(), (req, res) => {
    console.log(req);
    let email = req.body.email;
    let password = req.body.password;
    User.findByCredentials(email, password).then((user) => {
    console.log(user);
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

router.get('/getAccessToken', verifySession,cors(), (req, res) => {
    req.userObject.generateAccessToken().then((accessToken) => {
        res
            .header('x-access-token', accessToken)
            .send({accessToken})
    }).catch((e) => {
        res.status(400).send(e);
    })
});

module.exports = router;
