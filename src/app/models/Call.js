
var schema = mongoose.Schema({
	user:{type:mongoose.SchemaTypes.ObjectId,ref:"User"},
	device:[{type:mongoose.SchemaTypes.ObjectId,ref:"Device"}],

	startedAt:{type:Date,default:Date.now},
	finishedAt:{type:Date}
	status:{type:String, enum:["finished","missed","answered","hung-up","disconnected"],default:"active"}
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Slideshow', schema);