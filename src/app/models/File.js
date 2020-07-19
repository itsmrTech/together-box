import shortid from "shortid";

var schema = mongoose.Schema({
	local_path:String,
	storage_path:String,
	access_url:String,
	code:{type:String,default:shortid.generate},
	uploader:{type:mongoose.SchemaTypes.ObjectId,ref:"User"},
	device:{type:mongoose.SchemaTypes.ObjectId,ref:"Device"},
	status:{type:String, enum:["deleted","deactive","local","uploaded"],default:"local"}
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('File', schema);