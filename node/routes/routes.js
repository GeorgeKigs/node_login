    module.exports = function (app,body_parser,models,passport) {

    var bcrypt=require('bcryptjs');
    var passport = require('passport');
    var models=require('../models/models');
    var verified = require('../models/verified');
    var crypto=require('crypto');
    var nodemailer=require('nodemailer');
    var publicIp= require('public-ip');
    const random=require('generate-password');
    var encoded = body_parser.urlencoded({ extended: false });
    // var localStrategy=require('passport-local').Strategy;


    // home page
    app.get(('/'), function(req,res){
        res.render('home',
            {
                data:null,
                title:"title",
                message:{}
            }
        );
    });

    app.post(('/'),encoded,function (req,res){
        res.render('home',
            {
                data:null,
                title:"Home",
                message:{}
            }
        );
    });
    

    // login page
    app.get(('/login'),function(req,res){
        
        res.render('login',
            {
                message:{},
                data:{},
                title:"Login Page"
                
            }
    );
    });

    app.post(('/login'),encoded,function(req,res,next){

            let query = {
                email:req.body.email
            }
            models.findOne(query, function (err,data) {
                if (err) throw err;
                if (!data){
                   res.render('login',
                   {
                       title:'login',
                       message:'no user found'
                   })
                }else{
                    if (data.verified==false){
                        var token=tokenGenerator();
                        sendMail(data.email,token);
                        enterVerifiedData(data.email,token)
                        res.render('forgot',
                        {
                            data:data,
                            title:"verification",
                            message:'The email has not verified. Enter your verification code sent to your email address'
                        });
                    }else if (data.verified==true) {
                        bcrypt.compare(req.body.password,data.password,function (err,isValid) {
                            if (err) throw err;
                            console.log('pass')
                            if (isValid){
                                var hello=passport.serializeUser(function (models,done) {
                                    done(models.id)
                                })
                                models.findOneAndUpdate({email:data.email},{loggedIn:true})
                                
                            res.render('home',{
                                data:data,
                                title:'welcome',
                                message:'welcome '+data.name+' '+hello})
                            }else{
                                res.render('login',{title:'title',message:'no user found'})
                            } 
                })} 
            }})
        });


    //registration page
    app.get(('/registration'), function(req,res){
        

        res.render('registration',{
           
            title:"Registration",
            error_message:{}
        });
    });

   


    app.post(('/registration'),encoded,function(req,res,next){
        models.findOne({email:req.body.email},function(err,user){
            if (err) throw err;
            if (user){
                res.render('registration',{
                    
                    title:"Registration",
                    error_message:'email address already used'
                })
            }else{
                var hash='';
                var token=tokenGenerator();
               

                bcrypt.genSalt(10,function (err,salt) {
                    if (err) throw err;
                    bcrypt.hash(req.body.password,salt, function(err,hash){
                        if (err) throw err;  
                        models({
                            name:req.body.name,
                            email:req.body.email,
                            tel:req.body.tel,
                            password:hash
                        }).save(function (err) {
                            if (err) throw err;
                        })
                    })
                })
                sendMail(req.body.email,token);
                enterVerifiedData(req.body.email,token);
                
                res.render('forgot',
                    {
                        data:req.body,
                        title:"verification",
                        message:"your account has been registered."
                    }
                );}
        });
    });

    function tokenGenerator(){
        return random.generate({length:8,numbers:true});
    }

    function sendMail(send_to,token){
        var transporter = nodemailer.createTransport({
            service:'Gmail',                         
            auth:{
                                        
                user:'jkymathy@gmail.com',
                pass:'thuranira810.',
                                        
                }});
    // var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
        
        
        var mailOptions = { 

            from: 'George <jkymathy@gmail.com>', 
            to: send_to, 
            subject : 'Account Verification Token',
            text:'hello from the other side\n'+'verify account \n enter the following code '+token}


        transporter.sendMail(mailOptions,function(err){
            if (err) throw err;
            console.log('email sent');
        })
        
    };



    // to enter the verification code in the database
    function enterVerifiedData(email,token) {
        verified.findOne({email:email},function (err,data) {
            if (err) throw err;
            if (!data){
                verified({
                    email:email,
                    token:token
                }).save(function(err){
                    if (err) throw err;
                })
            
            }else{
                verified.updateOne({email:email},{token:token}, function(err){
                    if (err)throw err;
                })
            }

        });
    }


    //resend code render verification
    app.post('/resend',encoded,function (req,res) {
        var token=tokenGenerator();
        sendMail(req.body.email,token)
        enterVerifiedData(req.body.email,token);
        res.render('forgot',{
            data:{},
            title:"verification",
            message:'your code has been sent'
        });
    })
    //forgot page
    app.get(('/forgot'), function(req,res){
        
        res.render('forgot',
        {
            data:null,
            title:"Forgot Password",
            message:null
        });
    });

    app.post(('/forgot'),encoded,function (req,res){

        var email= req.body.email;

        res.render('forgot',{
            data:{},
            title:"verification",
            message:'your code has been sent'
        });
    });

    app.post('/verification',encoded,function(req,res){
        var code = req.body.verification_code;
        var email = req.body.email
        
        verified.findOneAndRemove({token:code}, function(err,data){
            if (err) throw err;
            if(!data){
                res.render('forgot',{
                    data:{},
                    title:"verification",
                    message:'Verification code does not exist. check your email.'
                });
            }else if (data){
                models.findOneAndUpdate({email:email},{verified:true},function (err,data) {
                    if (err) throw err;
                
                    res.render('home',{
                        data:data,
                        title:"home page",
                        message:'hello world'
                    })
                })
            }
    
        })

       
             
        })


    function verificationAndEntry(data) {
        
    }


    //second page
    app.get(('/second_page'),function(req,res){
        
        res.render('second',
        {
            data:{},
            title:"Second page"
        });
    });

    app.post(('/second_page'),encoded,function (req,res){
        res.render('second',{
            data:{},
            title:"Second Page"
        });
    });






    //logout and set logged in by user = false
    app.get('/logout',encoded,function (req,res) {
        models.findOneAndUpdate({email:req.body.email},{loggedIn:false})
        models.findOneAndUpdate({})
        passport.deserializeUser(function(id,done){
            models.findById(id,function(err,user){
                done(err,user)
            })
        });
        res.redirect('/login',{message:'you have logged out'},200);
    })


    // check later......
    // function requiresAuthentication(req,res,next){
    //     if (req.session.user){
    //         return next();
    //     }else{
    //         res.render('login',
    //         {
    //             message:'please login',
    //             data:{},
    //             title:"Login Page"
                
    //         })
    //     }
    // };
};