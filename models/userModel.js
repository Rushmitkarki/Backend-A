const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        requires : true,
    },
    lastName: {
        type : String,
        requires : true,
    },
    email: {
        type : String,
        requires : true,
    },
    password: {
        type : String,
        requires : true,
    },
    // defining the role for admin 
    isAdmin :{
        type : Boolean,
        default : false,    
    
    }


})
const User = mongoose.model('users', userSchema)


module.exports = User;