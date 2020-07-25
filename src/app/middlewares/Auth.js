/**
 *          .::AUTHENTICATION::.
 * Authentication operations belong here.
 * 
 */
import User from '../models/User';
import {
	verify
} from './Token';
import Device from '../models/Device';
//The KEY that has token
const TOKENKEY = "x-access-token"
const DEVICEKEY = "device-code"

export const optionalAuth = (req, res, next) => {
	req.optionalAuth = true;
	next()
}
//API AUTHENTICATION
export default async function auth(req, res, next) {
	//Getting Token
	if (req.headers[TOKENKEY]) var api_token = req.headers[TOKENKEY];
	else if(req.cookies[TOKENKEY]) var api_token=req.cookies[TOKENKEY];
	//TOKENNOTFOUND Handling
	if (!api_token) {
		if(req.optionalAuth)return next();
		return res.validSend(401, "The following keys are required in request header: \n " + TOKENKEY + "\n")
	}
	//Verifying token
	var verified = await verify(api_token);
	//Verifying token error handling
	if (verified.error) return res.validSend(401, verified);
	//Adding verified user information to request object.
	_.mapKeys(verified, (value, key) => {
		return req[key] = value;
	});

	next();
}
export const deviceAuth=async(req,res,next)=>{
	if (req.headers[DEVICEKEY]) var device_code = req.headers[DEVICEKEY];
	else if (req.cookies[DEVICEKEY]) var device_code = req.cookies[DEVICEKEY];
	if(!device_code){
		if(req.optionalAuth)return next();
		return res.validSend(401, "The following keys are required in request header: \n " + DEVICEKEY + "\n")
	}
	let device=await Device.findOne({code:device_code,status:"active"}).lean()
	if(!device)return res.validSend(401,{error:"Device code is not valid."})
	req.device={...device};
	next();
}