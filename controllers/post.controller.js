const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const mongoose = require('mongoose');

const methods = {
    async onCreatePost(req, res)
    {
        try
        {
            const post = new Post({
                userId: req.user._id,
                content: req.body.content,
                likes: [],
                comments: [],
                repost: req.body.repost ? new mongoose.Types.ObjectId(req.body.repost) : null,
            });

            post.save().then((data) =>
            {
                try
                {
                    if (data)
                    {
                        return res.status(201).json({
                            status: 201,
                            message: 'Post created successfully..!'
                        });
                    }
                } catch (error)
                {
                    if (error)
                    {
                        return res.status(400).json({
                            status: 400,
                            message: error.message
                        });
                    }
                }
            });
        } catch (error)
        {
            if (error)
            {
                return res.status(500).json({
                    status: 500,
                    message: error.message
                });
            }
        }
    },
    async onGetAllPost(req, res)
    {
        try
        {
            const posts = await Post.find({}).lean(); // Use `lean()` to get plain JavaScript objects

            if (!posts || posts.length === 0)
            {
                return res.status(200).json({
                    status: 200,
                    result: null
                });
            }

            const result = await Promise.all(
                posts.map(async (post) =>
                {
                    const profile = await Profile.findOne({ userId: post.userId }).populate('userId', 'username');

                    // Populate user information for comments
                    const populatedComments = await Promise.all(
                        post.comments.map(async (comment) =>
                        {
                            const commentProfile = await Profile.findOne({ userId: comment.userId }).populate('userId', 'username');

                            return {
                                _id: comment._id,
                                content: comment.content,
                                profile: {
                                    userId: commentProfile.userId._id,
                                    username: commentProfile.userId.username,
                                    picture: commentProfile.picture,
                                },
                                likes: comment.likes,
                                createdAt: comment.createdAt,
                            };
                        })
                    );

                    return {
                        _id: post._id,
                        profile: {
                            userId: profile.userId._id,
                            username: profile.userId.username,
                            picture: profile.picture,
                        },
                        content: post.content,
                        likes: post.likes,
                        comments: populatedComments, // Assign the populated comments
                        repost: post.repost ?? null,
                        createdAt: post.createdAt,
                    };
                })
            );


            return res.status(200).json({
                status: 200,
                result: result
            });
        } catch (error)
        {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    async onGetPostsByUserId(req, res)
    {
        try
        {
            const userId = req.query.userId;
            if (!userId)
            {
                return res.status(400).json({
                    status: 400,
                    result: null,
                    message: "User id is required"
                });
            }
            const posts = await Post.find({ userId }).lean(); // Use `lean()` to get plain JavaScript objects

            if (!posts || posts.length === 0)
            {
                return res.status(200).json({
                    status: 200,
                    result: null
                });
            }

            const result = await Promise.all(
                posts.map(async (post) =>
                {
                    const profile = await Profile.findOne({ userId: post.userId }).populate('userId', 'username');

                    // Populate user information for comments
                    const populatedComments = await Promise.all(
                        post.comments.map(async (comment) =>
                        {
                            const commentProfile = await Profile.findOne({ userId: comment.userId }).populate('userId', 'username');

                            return {
                                _id: comment._id,
                                content: comment.content,
                                profile: {
                                    userId: commentProfile.userId._id,
                                    username: commentProfile.userId.username,
                                    picture: commentProfile.picture,
                                },
                                likes: comment.likes,
                                createdAt: comment.createdAt,
                            };
                        })
                    );

                    return {
                        _id: post._id,
                        profile: {
                            userId: profile.userId._id,
                            username: profile.userId.username,
                            picture: profile.picture,
                        },
                        content: post.content,
                        likes: post.likes,
                        comments: populatedComments, // Assign the populated comments
                        repost: post.repost ?? null,
                        createdAt: post.createdAt,
                    };
                })
            );


            return res.status(200).json({
                status: 200,
                result: result
            });
        } catch (error)
        {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    async onGetOne(req, res)
    {
        try
        {
            const postId = req.query.postId; // Assuming you're passing the post ID as a parameter

            const post = await Post.findById(postId).lean(); // Use `lean()` to get a plain JavaScript object

            if (!post)
            {
                return res.status(404).json({
                    status: 404,
                    result: null,
                    message: 'Post not found',
                });
            }

            const profile = await Profile.findOne({ userId: post.userId }).populate('userId', 'username');

            // Populate user information for comments
            const populatedComments = await Promise.all(
                post.comments.map(async (comment) =>
                {
                    const commentProfile = await Profile.findOne({ userId: comment.userId }).populate('userId', 'username');

                    return {
                        _id: comment._id,
                        content: comment.content,
                        profile: {
                            userId: commentProfile.userId._id,
                            username: commentProfile.userId.username,
                            picture: commentProfile.picture,
                        },
                        likes: comment.likes,
                        createdAt: comment.createdAt,
                    };
                })
            );

            const result = {
                _id: post._id,
                profile: {
                    userId: profile.userId._id,
                    username: profile.userId.username,
                    picture: profile.picture,
                },
                content: post.content,
                likes: post.likes,
                comments: populatedComments, // Assign the populated comments
                repost: post.repost ?? null,
                createdAt: post.createdAt,
            };

            return res.status(200).json({
                status: 200,
                result: result,
            });
        } catch (error)
        {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    ,
    async onDeletePost(req, res)
    {
        try
        {
            if (!req.query.postId) return res.status(400).json({
                message: "Post id is required"
            });

            Post.findById(req.query.postId).then((post) =>
            {
                if (post)
                {
                    if (String(post.userId) !== String(req.user._id)) return res.status(403).json({ message: 'You do not have permission to delete this post' });

                    post.deleteOne();

                    return res.status(200).json({ message: 'Post deleted successfully' });

                } else
                {
                    return res.status(404).json({
                        status: true,
                        result: null,
                        message: "Post not found"
                    });
                }
            });

        } catch (error)
        {
            if (error) return res.status(400).json({
                message: error.message
            });
        }
    },
    async onLikePost(req, res)
    {
        try
        {
            const postId = req.query.postId;
            const userId = req.user._id;

            // Check if the postId and userId are provided
            if (!postId || !userId)
            {
                return res.status(400).json({ message: 'Post ID and User ID are required' });
            }

            // Find the post by postId and check if it exists
            const post = await Post.findById(postId);

            if (!post)
            {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the user has already liked the post
            if (post.likes.includes(userId))
            {
                return res.status(400).json({ message: 'You have already liked this post' });
            }

            // Add the user's ID to the post's likes array
            post.likes.push(userId);

            // Save the updated post
            await post.save();

            return res.status(200).json({ status: 200, message: 'Post liked successfully' });
        } catch (error)
        {
            return res.status(500).json({ message: error.message });
        }
    },
    async onUnlikePost(req, res)
    {
        try
        {
            const postId = req.query.postId;
            const userId = req.user._id;
            // Check if the postId and userId are provided
            if (!postId || !userId)
            {
                return res.status(400).json({ message: 'Post ID and User ID are required' });
            }

            // Find the post by postId and check if it exists
            const post = await Post.findById(postId);

            if (!post)
            {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the user has liked the post
            if (!post.likes.includes(userId))
            {
                return res.status(400).json({ message: 'You have not liked this post' });
            }

            // Remove the user's ID from the post's likes array
            post.likes = post.likes.filter((likeUserId) => likeUserId.toString() !== userId.toString());

            // Save the updated post
            await post.save();

            return res.status(200).json({ status: 200, message: 'Post unliked successfully' });
        } catch (error)
        {
            return res.status(500).json({ message: error.message });
        }
    },
    async onCreateComment(req, res)
    {
        try
        {
            if (!req.query.postId)
            {
                return res.status(400).json({
                    message: "Post id is required"
                });
            }
            if (!req.body.content)
            {
                return res.status(400).json({
                    message: "Content is required"
                });
            }

            const newComment = {
                userId: req.user._id,
                content: req.body.content,
                likes: []
            };

            const post = await Post.findByIdAndUpdate(
                req.query.postId,
                {
                    $push: {
                        comments: newComment
                    }
                },
                { new: true }
            );

            if (!post)
            {
                return res.status(400).json({
                    message: "Post not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Comment created successfully",
            });
        } catch (error)
        {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    async onLikeComment(req, res)
    {
        try
        {
            const postId = req.query.postId;
            const userIdToLike = req.body.userId; // User ID of the comment creator

            if (!postId || !req.body.userId)
            {
                return res.status(400).json({
                    message: "Post id and user id are required"
                });
            }

            const post = await Post.findByIdAndUpdate(
                postId,
                {
                    $push: {
                        "comments.$[comment].likes": req.user._id
                    }
                },
                {
                    new: true,
                    arrayFilters: [{ "comment.userId": userIdToLike }]
                }
            );

            if (!post)
            {
                return res.status(400).json({
                    message: "Post not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Successfully liked the comment",
            });
        } catch (error)
        {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    async onUnlikeComment(req, res)
    {
        try
        {
            const postId = req.query.postId;
            const userIdToUnlike = req.body.userId; // User ID of the comment creator

            if (!postId || !userIdToUnlike)
            {
                return res.status(400).json({
                    message: "Post id and user id are required"
                });
            }

            const post = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: {
                        "comments.$[comment].likes": req.user._id
                    }
                },
                {
                    new: true,
                    arrayFilters: [{ "comment.userId": userIdToUnlike }]
                }
            );

            if (!post)
            {
                return res.status(400).json({
                    message: "Post not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Successfully unliked the comment",
            });
        } catch (error)
        {
            return res.status(400).json({
                message: error.message
            });
        }
    }
    ,
    async onDeleteComment(req, res)
    {
        try
        {
            const postId = req.query.postId;
            const commentId = req.query.commentId;

            if (!postId || !commentId)
            {
                return res.status(400).json({
                    message: "Post ID and Comment ID are required."
                });
            }

            const post = await Post.findById(postId);
            if (!post)
            {
                return res.status(404).json({
                    message: "Post not found"
                });
            }

            // Find the comment by its ID within the post's comments array
            const comment = post.comments.find(comment => comment._id == commentId);

            if (!comment)
            {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }

            // Check if the comment's userId matches the current user's _id
            if (comment.userId.toString() === req.user._id.toString())
            {
                // If they match, remove the comment
                post.comments = post.comments.filter(comment => comment._id != commentId);
                await post.save();

                return res.status(200).json({
                    status: 200,
                    message: "Comment deleted successfully",
                });
            } else
            {
                return res.status(403).json({
                    message: "You don't have permission to delete this comment"
                });
            }
        } catch (error)
        {
            return res.status(500).json({
                message: error.message
            });
        }
    }


};

module.exports = { ...methods };