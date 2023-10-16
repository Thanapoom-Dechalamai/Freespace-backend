const User = require('../models/user.model');
const Profile = require('../models/profile.model');

const methods = {
    async onGetUserInfo(req, res)
    {
        User.findById(req.user._id)
            .then((user) =>
            {
                if (user)
                {
                    Profile.findOne({ userId: req.user._id }).then((profile) =>
                    {
                        return res.status(200).json({
                            userId: req.user._id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            username: user.username,
                            following: profile.following,
                            followers: profile.followers
                        });
                    });

                } else
                {
                    return res.status(400).json({
                        message: "User not found..!"
                    });
                }
            }).catch((error) =>
            {
                return res.status(200).json({
                    message: error.message
                });
            });
    }
};

module.exports = methods;