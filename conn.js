const mongoose = require('mongoose');
const {db} = require('./configs/keys')

mongoose.connect(db.MONGO_URI)
.then(()=>{
    console.log("Database is Connected!!")
})
.catch((err)=>{
    console.log(err);
})