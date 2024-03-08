const {payment} = require('../../configs/keys')
const router = require('express').Router()
const stripe = require('stripe')(payment.SECRET_KEY)
router.post('/create-checkout-session',async(req,res)=>{
    const products = req.body;
    const line_items = products.map((product)=>({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.name
            },
            unit_amount: product.price * 100
        },
        quantity: product.quantity
    }))
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], //4000003560000008
        line_items,
        mode:"payment",
        success_url:payment.FRONTEND_URL,
        cancel_url:payment.FRONTEND_URL
    })
    res.json({id:session.id})

})

module.exports = router