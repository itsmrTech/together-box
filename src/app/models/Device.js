
var schema = mongoose.Schema({
	name:String,
	status:{type:String, enum:["deleted","deactive","active"],default:"active"}

});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Device', schema);