const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/authentication', { useNewUrlParser:true });

const tokensSchema = mongoose.Schema({
        
    email:String,
    token:{
        type:String,
        expires:4600,
        required:true,
    },
    time:{
        type:Date,
        default:Date.now,
    }
},{
    collection:'Token'
})
const verified = module.exports = mongoose.model('Token',tokensSchema);