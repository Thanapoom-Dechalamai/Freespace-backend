const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    content: {
        type: String,
        validate: {
            validator: function (value)
            {
                // If the `reposts` array is empty, require a non-empty `content`
                return !(!this.reposts || this.reposts === '') || (value && value.length > 0);
            },
            message: 'Content is required.'
        },
        min: 1,
        max: 2000
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            content: {
                type: String,
                required: true,
                min: 1,
                max: 2000
            },
            likes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                }
            ],
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    repost:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
    }

}, { timestamps: true });

module.exports = mongoose.model('posts', schema);
