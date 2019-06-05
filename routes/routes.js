module.exports = function (app,body_parser,models) {

    var bcrypt=require('bcryptjs');
    var passport = require('passport');
    var models=require('../models/models');
    var encoded = body_parser.urlencoded({ extended: false });
    var localStrategy=require('passport-local').Strategy;

    
    app.use(passport.initialize());
    app.use(passport.session());


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


    
    app.post(('/login'),encoded,function(req,res){

            
            console.log('local strategy');
    
            let query = {
                email:req.body.email
            }
            models.findOne(query, function (err,data) {
                if (err) throw err;
                console.log('db')

                if (!data){
                   res.render('login',
                   {
                       title:'login',
                       message:'no user found'
                   })
                }else{

                bcrypt.compare(req.body.password,data.password,function (err,isValid) {
                    if (err) throw err;
                    console.log('pass')
                    if (isValid){
                        var hello=passport.serializeUser(function (models,done) {
                            done(models.id)
                        })
                        
                       res.render('home',{
                           data:data,
                           title:'welcome',
                           message:'welcome '+data.name+' '+hello})
                    }else{
                        res.render('login',{title:'title',message:'no user found'})
                    } 
                }) 
            }})
        });


    //registration page
    app.get(('/registration'), function(req,res){
        

        res.render('registration',{
           
            title:"Registration",
            error_message:{}
        });
    });

    app.post(('/registration'),encoded,function(req,res){
        models.findOne({email:req.body.email},function(err,user){
            if (user){
                res.render('registration',{
                    
                    title:"Registration",
                    error_message:'email address already used'
                })
            }else{
                        
                bcrypt.genSalt(15,function (err,salt) {
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
                            res.render('home',
                                {
                                    data:req.body,
                                    title:"Registration",
                                    message:"your account has been registered."
                                }
                            );
                        })

                    })
                })
            }
        });
        
    });


    //forgot page
    app.get(('/forgot'), function(req,res){
        
        res.render('forgot',
        {
            data:{},
            title:"Forgot Password"
        });
    });

    app.post(('/forgot'),encoded,function (req,res){
        res.render('forgot',{
            data:{},
            title:"Forgot Password"
        });
    });

    //second page
    app.get(('/second_page'),requiresAuthentication ,function(req,res){
        
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

    app.post('/logout',encoded,function (res,req) {
        passport.deserialize(function(id,done){
            models.findById(id,function(err,user){
                done(err,user)
            })
        })
        res.render('login',{message:'you have logged out'})
    })

    function requiresAuthentication(req,res,next){
        if (req.isAuthenticated()){
            return next();
        }else{
            res.render('login',
            {
                message:'please login',
                data:{},
                title:"Login Page"
                
            })
        }
    };
    
};