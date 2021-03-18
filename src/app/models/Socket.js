
import shortid from "shortid"
var schema = mongoose.Schema({
    socketid:String,
	state:{type:String,enum:["offline","away","online"]},
    pingedAt:{type:Date,default:Date.now()},
    device:{type:mongoose.SchemaTypes.ObjectId,ref:"Device"},
    user:{type:mongoose.SchemaTypes.ObjectId,ref:"User"},
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Socket', schema);