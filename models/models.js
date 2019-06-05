// import { Mongoose } from "mongoose";


    const mongoose=require('mongoose');

    mongoose.connect('mongodb://localhost/authentication', { useNewUrlParser:true });
    
    const appUsersModel = mongoose.Schema({
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        tel:{
            type:Number,
            required:true,
        },
        password:{
            type:String,
            required:true,
        }

    },
    {
        collection:'Users'
    });




const model = module.exports = mongoose.model('Users',appUsersModel);

