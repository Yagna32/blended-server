const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref:'Users',
        required: true,
    },
    orders: [{
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

const Order = mongoose.model('Orders',OrderSchema)

module.exports = Order

