const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Types.ObjectId,
        ref:'Product',
        required: true,
    },
    reviews: [{
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Users'
        },
        rating: {
            type: Number,
            min: 0,
            max: 5
        },
        review: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalReviews: {
        type: Number
    },
    ratings : {
        type: Number,
        min: 0,
        max: 5
    }
},{strict:'throw'})

const Review = mongoose.model('Reviews',ReviewSchema)

module.exports = Review

