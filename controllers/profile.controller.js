const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const { areObjectsEqual } = require('../helpers/tools');
const { isUsernameAvailable } = require('../helpers/tools');

const methods = {
    async createProfile(user, res)
    {
        try
        {
            const profile = new Profile({
                userId: user._id,
                caption: user.caption,
                picture: user.picture,
                following: [],
                followers: []
            });
            profile.save().then((data) =>
            {
                try
                {
                    if (data) return res.status(201).json({
                        status: 201,
                        message: 'User created successfully..!'
                    });
                } catch (error)
                {
                    if (error)
                    {
                        console.log(error);
                        return res.status(400).json({
                            status: 400,
                            message: error
                        });
                    };
                }
            });
        } catch (error)
        {
            if (error)
            {
                console.log(error);
                return res.status(400).json({
                    message: error.message
                });
            };
        }
    },
    async onCreate(req, res)
    {
        try
        {
            Profile.findOne({ userId: req.user._id })
                .then((profile) =>
                {

                    if (profile)
                    {
                        return res.status(400).json({
                            message: "User already has a profile"
                        });
                    }
                    const _profile = new Profile({
                        userId: req.user._id,
                        caption: req.body.caption,
                        picture: req.body.picture,
                        following: [],
                        followers: []
                    });
                    console.log(_profile);
                    _profile.save().then((data) =>
                    {
                        try
                        {
                            if (data) return res.status(201).json({
                                status: 201,
                                message: 'Profile created successfully..!'
                            });
                        } catch (error)
                        {
                            if (error)
                            {
                                console.log(error);
                                return res.status(400).json({
                                    status: 400,
                                    message: error.message
                                });
                            };
                        }
                    });
                });


        } catch (error)
        {
            if (error)
            {
                console.log(error);
                return res.status(400).json({
                    status: 400,
                    message: error.message
                });
            };
        }
    },
    async onGetAll(req, res)
    {
        try
        {
            Profile.find({}).populate('userId', 'firstname lastname username').then((profiles) =>
            {
                if (profiles)
                {
                    const result = [];
                    profiles.map((profile) =>
                    {
                        result.push({
                            userId: profile.userId._id,
                            firstname: profile.userId.firstname,
                            lastname: profile.userId.lastname,
                            username: profile.userId.username,
                            caption: profile.caption,
                            picture: profile.picture,
                            following: profile.following,
                            followers: profile.followers
                        });
                    });
                    return res.status(200).json({
                        status: 200,
                        result: result
                    });
                } else
                {
                    return res.status(200).json({
                        status: 200,
                        result: null
                    });
                }
            });
        } catch (error)
        {
            if (error) return res.status(400).json({
                status: 400,
                message: error.message
            });
        }
    },
    async onGetOne(req, res)
    {
        try
        {
            const username = req.query.username;

            if (!username) return res.status(400).json({
                status: 400,
                message: "Username is required."
            });

            User.findOne({ username: username }).then((user) =>
            {
                if (!user) 
                {
                    return res.status(404).json({
                        status: 404,
                        result: null,
                        message: "Profile not found"
                    });
                }
                Profile.findOne({ userId: user._id }).populate('userId', 'username firstname lastname')
                    .then((profile) =>
                    {
                        if (profile)
                        {
                            return res.status(200).json({
                                status: 200,
                                result: {
                                    userId: user._id,
                                    firstname: profile.userId.firstname,
                                    lastname: profile.userId.lastname,
                                    username: profile.userId.username,
                                    caption: profile.caption,
                                    picture: profile.picture,
                                    following: profile.following,
                                    followers: profile.followers
                                }
                            });
                        } else
                        {
                            return res.status(404).json({
                                status: 404,
                                result: null,
                                message: "Profile not found"
                            });
                        }
                    });
            }).catch((error) =>
            {
                return res.status(500).json({
                    status: 500,
                    result: null,
                    message: error.message
                });
            });


        } catch (error)
        {
            if (error) return res.status(400).json({
                status: 400,
                message: error.message
            });
        }
    },
    async onGetById(req, res)
    {
        try
        {
            const userId = req.query.userId;

            if (!userId) return res.status(400).json({
                status: 400,
                message: "User id is required."
            });


            Profile.findOne({ userId: userId }).populate('userId', 'username firstname lastname')
                .then((profile) =>
                {
                    if (profile)
                    {
                        return res.status(200).json({
                            status: 200,
                            result: {
                                userId: userId,
                                firstname: profile.userId.firstname,
                                lastname: profile.userId.lastname,
                                username: profile.userId.username,
                                caption: profile.caption,
                                picture: profile.picture,
                                following: profile.following,
                                followers: profile.followers
                            }
                        });
                    } else
                    {
                        return res.status(404).json({
                            status: 404,
                            result: null,
                            message: "Profile not found"
                        });
                    }
                });
        } catch (error)
        {
            if (error) return res.status(400).json({
                status: 400,
                message: error.message
            });
        }
    },
    async onUpdate(req, res)
    {
        try
        {
            const profile = await Profile.findOne({ userId: req.user._id });
            const user = await User.findById(req.user._id);

            // Check if the user exists.
            if (!user)
            {
                return res.status(404).json({
                    status: 404,
                    message: "User not found.",
                });
            }

            // Check if the profile exists.
            if (!profile)
            {
                return res.status(404).json({
                    status: 404,
                    message: "Profile not found.",
                });
            }

            // Check if the user has permission to edit the profile.
            if (String(profile.userId) !== String(req.user._id))
            {
                return res.status(403).json({
                    status: 403,
                    message: "You don't have permission to edit this profile.",
                });
            }

            // Update the user and profile if the request contains username, firstname, or lastname.
            if (req.body.username || req.body.firstname || req.body.lastname)
            {
                // Check if the username is available.
                if (!isUsernameAvailable(req.body.username))
                {
                    return res.status(400).json({
                        status: 400,
                        message:
                            "Username is not available. Usernames must contain only English letters (A-Z, a-z), dots (.), and underscores (_).",
                    });
                }

                // Update the user.
                user.username = req.body.username || user.username;
                user.firstname = req.body.firstname || user.firstname;
                user.lastname = req.body.lastname || user.lastname;

                await user.save();
            }

            // Update the profile with any other changes.
            for (const key in req.body)
            {
                if (req.body.hasOwnProperty(key))
                {
                    profile[key] = req.body[key];
                }
            }

            // Check if the profile has changed.
            const prevProfile = Object.assign({}, profile._doc);
            if (areObjectsEqual(prevProfile, profile) && !req.body.username && !req.body.firstname && !req.body.lastname)
            {
                return res.status(400).json({
                    status: 400,
                    message: "Nothing has changed.",
                });
            }

            // Save the changes to the profile.
            const updatedProfile = await profile.save();
            if (updatedProfile)
            {
                return res.status(200).json({
                    status: 200,
                    message: "Profile edited successfully.",
                });
            }
        } catch (error)
        {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },
    async onDelete(req, res)
    {
        try
        {
            Profile.findOne({ userId: req.user._id }).then((profile) =>
            {
                if (profile)
                {
                    if (String(profile.userId) !== String(req.user._id)) return res.status(403).json({ message: 'You do not have permission to delete this profile' });

                    profile.deleteOne();

                    return res.status(200).json({ status: 200, message: 'Profile deleted successfully' });

                } else
                {
                    return res.status(404).json({
                        status: 404,
                        result: null,
                        message: "Profile not found"
                    });
                }


            });

        } catch (error)
        {
            if (error) return res.status(400).json({
                status: 400,
                message: error.message
            });
        }
    },
    async onFollow(req, res)
    {
        try
        {
            // Check if the user id is provided.
            if (!req.body.userId)
            {
                return res.status(400).json({
                    status: 400,
                    message: "User id is required",
                });
            }

            // Update the follower profile.
            await Profile.findOneAndUpdate(
                { userId: req.body.userId },
                {
                    $push: { followers: req.user._id },
                },
                { new: true }
            );

            // Update the following profile.
            await Profile.findOneAndUpdate(
                { userId: req.user._id },
                {
                    $push: { following: req.body.userId },
                },
                { new: true }
            );

            // Return a success response.
            return res.status(200).json({
                status: 200,
                message: "Success",
            });
        } catch (error)
        {
            // Return an error response.
            return res.status(500).json({
                status: 500,
                message: error.message,
            });
        }
    },
    async onUnFollow(req, res)
    {
        try
        {
            // Check if the user id is provided.
            if (!req.body.userId)
            {
                return res.status(400).json({
                    status: 400,
                    message: "User id is required",
                });
            }

            // Update the follower profile.
            await Profile.findOneAndUpdate(
                { userId: req.body.userId },
                {
                    $pull: { followers: req.user._id },
                },
                { new: true }
            );

            // Update the following profile.
            await Profile.findOneAndUpdate(
                { userId: req.user._id },
                {
                    $pull: { following: req.body.userId },
                },
                { new: true }
            );

            // Return a success response.
            return res.status(200).json({
                status: 200,
                message: "Success",
            });
        } catch (error)
        {
            // Return an error response.
            return res.status(500).json({
                status: 500,
                message: error.message,
            });
        }
    },
    async onGetProfileImage(req, res)
    {
        try
        {
            // Get the user id from the query parameters.
            const userId = req.query.userId;

            // Check if the user id is provided.
            if (!userId)
            {
                return res.status(400).json({
                    status: 400,
                    message: "User id is required",
                });
            }

            // Find the profile with the specified user id.
            const profile = await Profile.findOne({ userId: userId });

            // Check if the profile exists.
            if (!profile)
            {
                return res.status(404).json({
                    status: 404,
                    message: "User not found",
                });
            }

            // Return the profile picture.
            return res.status(200).json({
                status: 200,
                result: profile.picture,
            });
        } catch (error)
        {
            // Return an error response.
            return res.status(500).json({
                status: 500,
                message: error.message,
            });
        }
    },
    async onGetProfileListByUsers(req, res)
    {
        try
        {
            const usersId = req.body.usersId;
            console.log(req.body);
            if (!usersId)
            {
                return res.status(400).json({
                    status: 400,
                    message: "Users id is required"
                });
            }

            Profile.find({
                userId: {
                    $in: usersId
                }
            }).populate('userId', 'firstname lastname username').then((profiles) =>
            {
                if (profiles)
                {
                    const result = [];
                    profiles.map((profile) =>
                    {
                        result.push({
                            userId: profile.userId._id,
                            firstname: profile.userId.firstname,
                            lastname: profile.userId.lastname,
                            username: profile.userId.username,
                            caption: profile.caption,
                            picture: profile.picture,
                            following: profile.following,
                            followers: profile.followers
                        });
                    });
                    return res.status(200).json({
                        status: 200,
                        result: result
                    });
                } else
                {
                    return res.status(200).json({
                        status: 200,
                        result: null
                    });
                }
            });
        } catch (error)
        {
            if (error) return res.status(400).json({
                status: 400,
                message: error.message
            });
        }
    },

};

module.exports = { ...methods };