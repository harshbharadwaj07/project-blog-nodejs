const mongoose=require('mongoose');
const evtSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }
});
module.exports=evtSchema;