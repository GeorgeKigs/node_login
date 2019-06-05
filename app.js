
// imports from modules
const express=require("express");
const body_parser=require("body-parser");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const passport =require("passport");
const session=require('express-session');
const random=require('generate-password');
const flash=require('connect-flash');
const validator=require('express-validator');



//imports from model files and controllers
const routes = require('./routes/routes');
const models = require('./models/models');
// const trial=require('./configurations/encryption');
//starting express
const app= express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('trust proxy', 1);
// trial();

//express session middleware

app.use(session({
    secret:random.generate( { length:12,numbers:true} ),
    resave:false,
    saveUninitialized:true,
    cookie:{secure:true}
}))

//messaging middleware

// app.use(require('connect-flash')());
// app.use(function (req,res,next) {
//     res.locals.messages = require('express-messages');
//     next();
// })

//passport requirements

//exporting the details to the controller and the models
routes(app,body_parser,bcrypt,models);
models(mongoose);

app.listen(3000, function () {
    console.log("listening to http://localhost:3000")
})