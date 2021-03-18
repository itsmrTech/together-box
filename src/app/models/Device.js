
import shortid from "shortid"
var schema = mongoose.Schema({
	name: String,
	status: { type: String, enum: ["deleted", "deactive", "active"], default: "active" },
	code: { type: String, default: () => shortid.generate() },
	socketid: String,
	owner: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
	users: [{
		user: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
		permissions:{}
	}],
	unique_name:{type:String,unique:true,required:true},
	timezone:String,
	country:String,
	language:String,
	calendar:{type:String,enum:["jalali","grogerian"]},
	current_performance:Object,
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Device', schema);