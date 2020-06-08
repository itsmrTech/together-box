/**
 *          .::USER MODEL::.
 * User Mongoose model
 * 
 */
import Hash from './sensitive/Hash';


var userSchema = mongoose.Schema({

	username: {
		type: String,
		required: true
	},
});

userSchema.plugin(mongooseTimestamp);
//UPDATING HASH WHEN PASSWORD IS CHANGED
userSchema.virtual('password').set(async function(password){
	return await Hash.update({user:this._id},{user:this._id,hash:password},{upsert:true});
})

//AUTHORIZE USER
userSchema.statics.authorize= function(user){
	return new Promise(async function(resolve,reject){
		try{
			//FINDING HASH
			var savedHash=await Hash.findOne({user:user._id});
			if(!savedHash) return reject("hash was not found");

			//COMPARING PASSWORD AND HASH
			var match=await bcrypt.compare(user.password,savedHash.hash);
			if(match) return resolve(true);
			return resolve(false);
		}catch(e){
			return reject(e);
		}

	})
}



export default mongoose.model('User', userSchema);