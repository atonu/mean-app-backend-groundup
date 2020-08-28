const {User} = require('../models/user.model');
const jwt = require('jsonwebtoken');

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

module.exports = {authenticate,verifySession};
