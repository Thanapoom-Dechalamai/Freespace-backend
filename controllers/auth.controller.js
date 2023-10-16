const { getRandomInteger } = require('../helpers/tools');
const { isUsernameAvailable } = require('../helpers/tools');
const User = require('../models/user.model');
const { createProfile } = require('./profile.controller');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const methods = {
    async onSignUp(req, res)
    {
        try
        {
            const { firstname, lastname, email, username, password } = req.body;

            if (!isUsernameAvailable(username))
            {
                return res.status(400).json({
                    message: 'Username is not available. Usernames must contain only English letters (A-Z, a-z), dots (.), and underscores (_).',
                });
            }
            // Check if username already exists
            const userByUsername = await User.findOne({ username });
            if (userByUsername)
            {
                return res.status(400).json({
                    message: 'Username already exists',
                });
            }

            // Check if email already exists
            const userByEmail = await User.findOne({ email });
            if (userByEmail)
            {
                return res.status(400).json({
                    message: 'Email already exists',
                });
            }

            const _user = new User({
                firstname,
                lastname,
                email,
                username,
                password
            });

            _user.save()
                .then((data) =>
                {
                    createProfile({ _id: data._doc._id, caption: "", picture: `https://freespace-api.onrender.com/images/${getRandomInteger(1, 9)}.jpg` }, res)
                        .catch((error) =>
                        {
                            return res.status(500).json({
                                message: error.message
                            });
                        });
                })
                .catch((error) =>
                {
                    return res.status(400).json({
                        message: error.message
                    });
                });

        } catch (error)
        {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    async onSignIn(req, res)
    {
        try
        {
            const user = await User.findOne({ email: req.body.email });

            if (!user)
            {
                return res.status(400).json({
                    message: 'User not found',
                });
            }

            const isPasswordValid = await user.authenticate(req.body.password);

            if (!isPasswordValid)
            {
                return res.status(400).json({
                    message: 'Incorrect password',
                });
            }

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            return res.status(200).json({
                accessToken: token,
            });
        } catch (error)
        {
            console.error(error);
            return res.status(500).json({
                message: 'Internal server error',
            });
        }
    },
};

module.exports = methods;