const router = require('express').Router()
const {Authenticate} = require('../../middlewares/tempAuth')
const Product = require('../../models/Product')
const Review = require('../../models/Reviews')
const User = require('../../models/Users')

router.post('/addReview',Authenticate,async(req,res)=>{
    const user = await User.findOne({email: req.user.email})
    const product = await Product.findOne({id:req.body.product_id})
    const newReview = {
        user_id:user._id,
        rating: Number(req.body.rating),
        review:req.body.review
    }
    if(product.totalReviews === 0) {
        const review = {
            product_id: product._id,
            reviews: [newReview],
            totalReviews: 1,
            ratings: newReview.rating
        }
        const  added_review= new Review(review)
        await added_review.save()
        product.totalReviews = product.totalReviews + 1;
        product.ratings = newReview.rating;
        await product.save()
        res.status(201).send(added_review)
    }
    else {
        const updatedreview = await Review.findOne({product_id:product._id})

        updatedreview.ratings = ((updatedreview.ratings*updatedreview.totalReviews) + newReview.rating)/(updatedreview.totalReviews+1);

        updatedreview.totalReviews = updatedreview.totalReviews + 1;
        updatedreview.reviews.push(newReview);
        await updatedreview.save()
        product.totalReviews = product.totalReviews + 1;
        product.ratings = updatedreview.ratings;
        await product.save()
        res.status(200).json(updatedreview)
    }
    
})

router.get('/getReviews',async(req,res)=>{
    const product_id = req.query.product;
    console.log(product_id)
    const product = await Product.findOne({id:product_id})
    console.log(product)
    const review = await Review.findOne({product_id:product._id})
    res.status(200).send(review)
})
module.exports = router