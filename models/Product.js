const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    image: {
        type:Array,
        required:true   
    },
    description: {
        type: String,
        retquired: true
    },
    category: {
        type:String,
        required:true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type:Number,
        required:true
    },
    date: {
        type: Date,
        default: Date.now        
    },
    available: {
        type: Boolean,
        default: true
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    ratings: {
        type: Number,
        default: 0
    }
})

mongoose.pluralize(false)
const Product = mongoose.model("Product",productSchema);

module.exports = Product
