
var schema = mongoose.Schema({
	url:String,
	status:{type:String, enum:["deleted","deactive","active"],default:"active"}
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Photo', schema);