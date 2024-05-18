const router = require('express').Router()
const { email } = require('../../configs/keys');
const { Authenticate } = require('../../middlewares/tempAuth');
const Order = require('../../models/Orders');
const Product = require('../../models/Product');
const User = require('../../models/Users');
const sampleOrder = {
    user: '603a8e284fd9b67a18e4d144', // Assuming this is a valid ObjectId referencing a user document
    orders: [
        {
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
        console.log(getorder)
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
        const getorder = await Order.findOne({user:getUser.id},{"orders._id":req.params.order_id}).populate('orders.products.product_id');
        console.log(getorder)
        res.send(getorder.orders[0])
    }catch (error) {
        console.log(error)
    }
})


router.post('/newOrder',Authenticate,async (req,res)=>{
    try {
        if(req.body.order_value ===0) return;
        const getUser = await User.findOne({email:req.user.email})
        const getorder = await Order.find({user:getUser.id});
        let products = []
        for (let i=0;i<getUser.cartData.length;i++) {
            const prodObj = await Product.findOne({id:getUser.cartData[i].product_id})
            products.push({product_id: prodObj._id,price: getUser.cartData[i].price})
        }

        let order=0
        if(getorder.length !==0){
            order = await Order.findOneAndUpdate(
                {user:getUser.id},
                {$push: { orders: [{products,order_value: req.body.order_value}]}},
                {new:true})
        }
        else
        {
            const newOrder = {
                user: getUser.id,
                orders: [{products,order_value: req.body.order_value}],
            }
            console.log('newOrder',newOrder)
            order = new Order(newOrder)
            await order.save()
        }
        console.log("order placed",order)
        res.status(201).json({success:true})
        await User.findOneAndUpdate({email:req.user.email},{cartData: []})
    }
    catch(error) {
        console.log(error)
    }
})

module.exports = router 