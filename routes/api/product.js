const express = require('express')
const cloudinary = require('cloudinary').v2
const router = express.Router();
const Product = require('../../models/Product')
const upload = require('../../middlewares/multer');


router.post('/addProduct',async(req,res,next)=>{
    try {
        const product = new Product({
            id:Date.now(),
            name:req.body.name,
            image:req.body.image,
            description:req.body.description,
            category:req.body.category,
            new_price:req.body.new_price,
            old_price:req.body.old_price
        });
        await product.save();
        res.json({
            success: true,
            id:product.id,
            name:product.name
        })
    }
    catch(error) {
        next(error)
    }
})

router.post('/removeProduct',async (req,res,next)=>{
    try {
        await Product.findOneAndDelete({id:req.body.id});
        res.json({
            success: true,
            name:req.body.name
        })
    }
    catch(error) {
        next(error)
    }
})

router.get('/allProducts',async(req,res,next)=>{
    try {
        const product = await Product.find();
        res.send(product)
    }
    catch(error) {
        next(error)
    }
})

router.get('/newCollections',async(req,res,next)=>{
    try {
        let products = await Product.find();
        let newCollections = products.slice(0).slice(-8);
        res.send(newCollections); 
    }
    catch(error) {
        next(error)
    } 
})

router.get('/popular/:category',async(req,res,next)=>{
    try {
        let products = await Product.find({category:req.params.category})
        let popular = products.slice(0,4);
        res.send(popular);
    }
    catch(error) {
        next(error)
    }
})

router.get('/:category',async(req,res,next)=>{
    try {
        let products = await Product.find({category:req.params.category}).skip((req.query.page-1)*12).limit(12);
        res.send(products);
    }
    catch(error) {
        next(error)
    }
})

//Creating upload enpoint for images
// const uploadsPath = path.resolve(__dirname, '../../upload/images'); // Adjust the path as needed
// router.use('/images',express.static(uploadsPath));
router.post('/upload',upload.array('product',4),async(req,res,next)=>{
    try {
        const uploadedFiles = req.files.map(async (file)=>{
            const base64Image = Buffer.from(file.buffer).toString("base64");
            const dataURI=`data:${file.mimetype};base64,${base64Image}`;
            const uploadResponse = await cloudinary.uploader.upload(dataURI);
            return uploadResponse.secure_url;
        })
        const image_urls = await Promise.all(uploadedFiles);
        res.json({
            success:1,
            image_urls
        })
    }
    catch(error) {
        next(error)
    }
})

module.exports =  router;