const express = require('express')
const path = require('path')
const cloudinary = require('cloudinary').v2

const router = express.Router();

const Product = require('../../models/Product')

const {port} = require('../../configs/keys');
const upload = require('../../middlewares/multer');


router.post('/addProduct',async(req,res)=>{
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
})

router.post('/removeProduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    res.json({
        success: true,
        name:req.body.name
    })
})

router.get('/allProducts',async(req,res)=>{
    const product = await Product.find();
    res.send(product)
})

router.get('/newCollections',async(req,res)=>{
    let products = await Product.find();
    let newCollections = products.slice(0).slice(-8);
    res.send(newCollections);  
})

router.get('/popular/:category',async(req,res)=>{
    let products = await Product.find({category:req.params.category})
    let popular = products.slice(0,4);
    res.send(popular);
})

//Creating upload enpoint for images
// const uploadsPath = path.resolve(__dirname, '../../upload/images'); // Adjust the path as needed
// router.use('/images',express.static(uploadsPath));
router.post('/upload',upload.array('product',4),async(req,res)=>{
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
})

module.exports =  router;