const mongoose=require ('mongoose')
const schema= mongoose.Schema
const hashschema=new schema({
    hashid:{
        type:String
    }

},{timestamps: true})
const user=mongoose.model('shash',hashschema)
module.exports=user