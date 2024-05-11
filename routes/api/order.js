const router = require('express').Router()
const { email } = require('../../configs/keys');
const { Authenticate } = require('../../middlewares/tempAuth');
const Order = require('../../models/Orders');
const User = require('../../models/Users');
const sampleOrder = {
    user: '603a8e284fd9b67a18e4d144', // Assuming this is a valid ObjectId referencing a user document
    orders: [
        {
            order_id: '603a8e284fd9b67a18e4d114', // Assuming this is a valid ObjectId for the order
            products: [
                {
                    product_id: '65e9631b31ffb7a9f8931b0a',
                    price: 50 // Assuming this is a valid ObjectId referencing a product document
                },
                {
                    product_id: '65e9c317c301233b2d4324fa',
                    price:50 // Another product ObjectId
                }
                // Add more products as needed
            ],
            order_value: 100, // Sample order value
        },
        // Add more orders as needed
    ]
};

router.get('/',Authenticate,async(req,res)=>{
    try {
        console.log(req.user)
        const getUser = await User.findOne({email:req.user.email})
        console.log(getUser)
        if(getUser===null) {
            res.status(400).json({message:"No Users Found"})
        }
        const getorder = await Order.find({user:getUser.id}).populate('orders.products.product_id');
        res.send(getorder[0].orders)
    }catch (error) {
        console.log(error)
    }
})

router.get('/:order_id',Authenticate,async(req,res)=>{
    try {
        console.log(req.user)
        const getUser = await User.findOne({email:req.user.email})
        console.log(getUser)
        if(getUser===null) {
            res.status(400).json({message:"No Users Found"})
        }
        const getorder = await Order.findOne({user:getUser.id},{"orders.order_id":req.params.order_id}).populate('orders.products.product_id');
        console.log(getorder)
        res.send(getorder.orders[0])
    }catch (error) {
        console.log(error)
    }
})

router.post('/newOrder',Authenticate,async (req,res)=>{
    try {
        const getUser = await User.findOne({email:req.user.email})
        const getorder = await Order.find({user:getUser.id});
        let order=0
        if(getorder.length !==0){
            order = await Order.findOneAndUpdate(
                {user:getUser.id},
                {$push: { orders: req.body}},
                {new:true})
        }
        else {
            sampleOrder.user = getorder.id
            sampleOrder.orders[0] = req.body
            order = new Order(sampleOrder)
            await order.save()
        }
        console.log("order placed",order)
        res.send(order)
    }
    catch(error) {
        console.log(error)
    }
})

module.exports = router 