import shortid from "shortid";
import {v4 as uuidv4} from "uuid"

var schema = mongoose.Schema({
    file:{type:mongoose.SchemaTypes.ObjectId,ref:"File"},
    key:{type:String,default:uuidv4}
});

schema.plugin(mongooseTimestamp);



export default mongoose.model('FileKey', schema);