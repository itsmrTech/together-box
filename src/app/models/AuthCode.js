
import shortid from "shortid"
var schema = mongoose.Schema({
    type:{type:String,enum:["pairing"]},
    code:{type:String,required:true},
    device:{type:mongoose.SchemaTypes.ObjectId,ref:"Device"},
    user:{type:mongoose.SchemaTypes.ObjectId,ref:"User"},
    expireAt:Date
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('AuthCode', schema);