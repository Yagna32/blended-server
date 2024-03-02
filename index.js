require('dotenv').config();
require('./conn');

const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const {port,CLOUDINARY} = require('./configs/keys')
const routes = require('./routes/routes')
const app = express();


cloudinary.config({
    cloud_name:CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.SECRET_KEY
})

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(routes)

app.use((err,req,res,next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            message: err.message,
            status: err.status || 500
        }
    })
})

app.listen(port,(err)=>{
    if(err) console.log(err);
    console.log("Server is running on Port : ",port);
})

// fetch('https://fakestoreapi.com/products')
//             .then(res=>res.json())
//             .then(json=>console.log(json))
