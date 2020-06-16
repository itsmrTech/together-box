
import shortid from "shortid"
var schema = mongoose.Schema({
	name:String,
	status:{type:String, enum:["deleted","deactive","active"],default:"active"},
	code:{type:String,default:()=>shortid.generate()},
	socketid:String,
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Device', schema);