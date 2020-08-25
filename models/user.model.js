const mongoose = require('mongoose');
const _ = require('lodash');
let bcrypt = require('bcryptjs');
let crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 1,
    },
    sessions: [{
        token: {
            type: String,
            required: false
        },
        expiresAt: {
            type: Number,
            required: false
        }
    }]

});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return _.omit(userObject, ['password', 'sessions']);
};

userSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;
    if (user.isModified('password')) {
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (!err) {
                    user.password = hash;
                    next();
                } else {
                    console.log('error', json.stringify(err, undefined, 2));
                }
            })
        })
    } else {
        next();
    }

});

userSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                console.log("chet" + err);
                console.log("baal" + res);
                if (res) {
                    resolve(user);
                } else {
                    reject("Auth Failed");
                }
            });
        })
    })
};


userSchema.methods.createSession = function () {

    let user = this;
    return user.generateRefreshToken().then((refreshToken) => {
        return saveSessionToDB(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject('Failed to save session: ' + e);
    })
};

/*HELPER METHODS*/
let saveSessionToDB = function (user, refreshToken) {
    return new Promise((resolve, reject) => {
        user.sessions.push({'token': refreshToken, 'expiresAt': generateRefreshTokenExpiryTime()});
        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            console.log("mongo save error: " + e);
        })
    })
};

let generateRefreshTokenExpiryTime = function () {
    let dayLimit = "10";
    let secondsLimit = ((dayLimit * 24) * 60) * 60;
    return ((Date.now() / 100) + secondsLimit);
};


//ynostatic
userSchema.methods.generateRefreshToken = function () {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex');
                return resolve(token); //check
            } else {
                return reject(err);
            }
        })
    })
};

const User = mongoose.model('User', userSchema);
module.exports = {User};
