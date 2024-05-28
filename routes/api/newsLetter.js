const express = require('express')
const sendMail = require('../../middlewares/nodemailer')
const {Authenticate} =require('../../middlewares/tempAuth')
const router = express.Router();

router.get('/',(req,res,next)=>res.send('Emailing service'))

router.get('/sendMail',Authenticate,async(req,res)=>{
    try {
        sendMail(req.user.email)
        res.json({
            success: true
        })
    }
    catch(error) {
        next(error)
    }
})

module.exports = router