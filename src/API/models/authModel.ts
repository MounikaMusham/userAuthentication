import mongoose from 'mongoose';

var  signUpSchema:any = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        min:3,
        max:15        
    },
    lastName:{
        type:String,
        required:true,
        min:3,
        max:15
    },
    gender:{
        type:String,
        required:true,
    },    
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },    
})
var signUpSchema:any = mongoose.model("UserAuthentication",signUpSchema);

export default signUpSchema