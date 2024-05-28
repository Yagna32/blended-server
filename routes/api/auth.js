const express = require('express')
const router = express.Router()
const {signAccessToken,signRefreshToken,verifyRefreshToken } = require('../../middlewares/tempAuth')
const User = require('../../models/Users')

router.post('/signup',async(req,res,next)=>{
    try{let check = await User.findOne({email:req.body.email})
    if(check) {
        return res.status(400).json({
            success: false,
            errors:"Email is already in use"
        })
    }
    const newUser = new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password
    })
    console.log(`${newUser.email} made an account`)
    await newUser.save();
    const access_token = await signAccessToken(newUser);
    const refresh_token = await signRefreshToken(newUser);
    res.json({
        success: true,
        access_token,
        refresh_token
    })
}catch(error) {
    console.log(error)
    next(error)
}
})

router.post('/login',async(req,res,next)=>{
    try{
        let user = await User.findOne({email:req.body.email})
    if(user) {
        const validPass = await user.isvalidPass(req.body.password)
        if(validPass){
            const newUser = {
                name:req.body.username,
                email:req.body.email,
                password:req.body.password
            }
            const access_token = await signAccessToken(newUser);
            const refresh_token = await signRefreshToken(newUser);
            console.log(`${newUser.email} Logged in`)
            res.json({
                success: true,
                access_token,
                refresh_token
            })
        }
        else {
            throw new Error("wrong password")
        }
    }
    else {
        throw new Error("user does not exist")
    }
}catch(error) {
    if(error.message === "user does not exist") {
        error.status = 404
    }
    else if (error.message === "wrong password") {
        error.status = 401
    }
    next(error)
}
})

router.get('/:email/getTokens',async(req,res,next)=>{
    const user = await User.findOne({email:req.params.email});
    try {
    if(!user) {
        throw new Error("user not found")
    }
    await verifyRefreshToken(req.headers['refresh-token'])
    }
    catch(error) {
        error.message = error.message === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
        error.status = error.message === "user not found" ? 404 : 401
        next(error)
        return;
    }
    console.log(`${req.params.email}  got new tokens`)
    const access_token = await signAccessToken(user);
    const refresh_token = await signRefreshToken(user);
    res.json({
    success: true,
    access_token,
    refresh_token
    })
})


module.exports =  router;