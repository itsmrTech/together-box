
import shortid from "shortid"
var schema = mongoose.Schema({
	
},{strict:false});

schema.plugin(mongooseTimestamp);



export default mongoose.model('Weather', schema);