const mongoose=require ('mongoose')
const schema= mongoose.Schema
const userschema=new schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
},{timestamps: true})
const user=mongoose.model('user',userschema)
module.exports=user