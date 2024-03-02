const express = require('express')
const router = express.Router()
const {signAccessToken,signRefreshToken,verifyRefreshToken } = require('../../middlewares/tempAuth')
const User = require('../../models/Users')

router.post('/signup',async(req,res)=>{
    let check = await User.findOne({email:req.body.email})
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

})

router.post('/login',async(req,res)=>{
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
            res.json({
                success: false,
                error: "Wrong Password"
            })
        }
    }
    else {
        res.json({
            success: false,
            error: "User does not exist"
        })
    }
})

router.get('/:email/getTokens',async(req,res,next)=>{
    const user = await User.findOne({email:req.params.email});
    if(!user) {
        res.status(404).json({
            success: false,
            error: "No Such User"
        })
    }
    try {
    const refresh_payload = await verifyRefreshToken(req.headers['refresh-token'])
    console.log(refresh_payload)
    }
    catch(error) {
        const message = error.message === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
        res.status(401).json({
            reason: "Invalid Token",
            error: message
        })
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