const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref:'Users',
        required: true,
    },
    orders: [{
        order_id: {
            type: mongoose.Types.ObjectId
        },
        products: [{
            product_id: {
                type: mongoose.Types.ObjectId,
                ref: 'Product'
            },
            price: {type: Number}
        }],
        order_value: {
            type: Number
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
},{strict:'throw'})

const Order = new mongoose.model('Orders',OrderSchema)

module.exports = Order

