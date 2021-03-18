
import shortid from "shortid"
var schema = mongoose.Schema({
	device:{type: mongoose.SchemaTypes.ObjectId, ref: "Device"},
	
},{strict:false});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Performance', schema);