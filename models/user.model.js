const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);
module.exports = {User};
