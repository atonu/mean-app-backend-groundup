const mongoose = require('mongoose');
const _ = require('lodash');
let bcrypt = require('bcryptjs');

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
    session: [{
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

userSchema.method.toJSON = () => {
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

const User = mongoose.model('User', userSchema);
module.exports = {User};
