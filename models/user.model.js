const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String
    }
}, { timestamps: true });

schema.virtual('password').set(function (password)
{
    this.hashPassword = bcrypt.hashSync(password, 10);
});

schema.virtual('fullname').get(function ()
{
    return `${this.firstname} ${this.lastname}`;
});

schema.methods = {
    authenticate: function (password)
    {
        return bcrypt.compare(password, this.hashPassword);
    }
};

module.exports = mongoose.model('users', schema); 