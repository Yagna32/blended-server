const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    password: {
        type: String
    },
    cartData:{
        type: Array
    },
    date: {
        type: Date,
        default:Date.now
    }
})


userSchema.pre('save',async function(next){
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
        next()
    }catch(error) {
        next(error)
    }
})

userSchema.methods.isvalidPass = async function(password){
    try {
        return await bcrypt.compare(password,this.password)
    }
    catch (err) {
        throw err
    }
}

const User = mongoose.model("Users",userSchema);
module.exports = User