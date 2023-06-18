const mongoose=require('mongoose');
const evtSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    writer:{
        type:String,
        required:true
    }
});
module.exports=evtSchema;