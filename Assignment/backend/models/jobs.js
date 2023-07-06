const mongoose=require('mongoose');
const jobSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    ctc:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    }
});
module.exports=jobSchema;