/**
 *          .::HASH MODEL::.
 * User's password hashes model
 * 
 */

var hashSchema = mongoose.Schema({

    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    hash: String,
});

hashSchema.plugin(mongooseTimestamp)

//HASHING PASSWORD
async function doHash(next) {
    try {
        var password = this.getUpdate().hash;
        this.getUpdate().hash = await bcrypt.hash(password, 10);
        next();
    } catch (e) {
        next(e);
    }
}
hashSchema.pre('update', doHash)
hashSchema.pre('updateOne', doHash)
hashSchema.pre('findOneAndUpdate', doHash)


export default mongoose.model('Hash', hashSchema);