const express = require('express')
const router = express.Router()
const User = require('../../models/Users')
const {Authenticate} = require('../../middlewares/tempAuth')
const {redis}=require('../../configs/keys')
const {Redis} = require('ioredis')

const redisClient = new Redis(redis.INTERNAL_URL)//redis.EXTERNAL_URL

const getUserCachedCart= (req,res,next)=>{
    console.log("hello")
    try {
    const email = req.user.email;
    redisClient.get(email,(err,data)=>{
        if(err) throw err;
        if(data !== null) {
            console.log(data);
            res.send(JSON.parse(data))
            return data;
        }
        else {
            next();
        }
    })
    }
    catch(err) {
        console.log(err)
    }
}

router.post('/addtoCart',Authenticate,async(req,res)=>{
    const updatedUser = await User.findOneAndUpdate({email:req.user.email},
        {$push: {cartData: {product_id: req.body.itemId,price:req.body.price}}},
        {new:true}
    )
    
    redisClient.setex(updatedUser.email,60,JSON.stringify(updatedUser.cartData));

    res.send(updatedUser.cartData)
})  


router.post('/removeFromCart',Authenticate,async(req,res)=>{
    let user = await User.findOne({email:req.user.email})
    let isProductInCart=false;
    let userCart=user.cartData;
    if(user && userCart.length > 0){
        const index = userCart.findIndex(obj=>obj["product_id"]===req.body.itemId)
        if(index !==-1){
            userCart.splice(index,1);
            isProductInCart=true;
        }
    }
    if(!isProductInCart) res.status(400).send();
    if(userCart <= 0){
        userData = await User.findOneAndUpdate(
            {email:req.user.email},{cartData:[]},{new:true}
            )
    }
    else {
        userData = await User.findOneAndUpdate(
            {email:req.user.email},{cartData:userCart},{new:true}
            )
    }
    redisClient.setex(userData.email,60,JSON.stringify(userData.cartData));
    res.send(userData.cartData);
})

router.get('/getCart',Authenticate,getUserCachedCart,async(req,res)=>{
    let userData = await User.findOne({email: req.user.email})
    if(userData)
    {
        redisClient.setex(userData.email,60,JSON.stringify(userData.cartData))
        res.json(userData.cartData)
        return;
    }
    res.json()

})


module.exports =  router;