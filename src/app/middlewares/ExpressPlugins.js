/**
 *          .::EXPRESS PLUGINS::.
 * Express plugins and all adding data to req and res are here.
 * 
 */
import isValid from './isValid';
export default (req, res, next) => {
	validators(req, res);

	next();
}
export let pushApis = (parent, routes) => {
	parent=process.env.API_PREFIX+parent
	routes.stack.forEach(function (r) {
		if (r.route && r.route.path) {
			globals.apis.push({ method: String(r.route.stack[0].method).toUpperCase(), path: parent + r.route.path })
		}
	})
}
//ADDING REQUEST AND RESPONSE VALIDATORS TO REQUEST
let validators = (req, res) => {
	res.validSend = isValid.res;
	req.res = res;
	req.validate = isValid.req;


}