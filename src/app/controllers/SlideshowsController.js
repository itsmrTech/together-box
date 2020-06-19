/**
 *          .::USER CONTROLLER::.
 * All related operations to User belong here. 
 * 
 */
import User from '../models/User';
import tokenize from '../middlewares/Token'
import ErrorHandler from '../middlewares/ErrorHandler';
import Device from '../models/Device';
import Slideshow from '../models/Slideshow';


/*          POST /api/users/register            */
export let create = async (req, res, next) => {
    //REQUEST VALIDATION
    req.validate(["username", "password"]);

    var {
        username,
        password
    } = req.body;
    try {
        //CHECK IF USER ALREADY EXISTS
        if (await User.findOne({ email })) throw { message: "email already exists.", code: 409 };
        //CREATING NEW USER OBJECT
        var newUser = new User({
            username,
            password
        });
        //SAVING USER
        var savedUser = await newUser.save();
        //GENERATING TOKEN
        var token = await tokenize(savedUser._id);

        //OK RESPONSE
        res.validSend(200, {
            registered: true,
            message: "User has been registered successfully.",
            token: token
        });
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }

}
export let details = async (req, res) => {
    // if (!req.validate(["device_code"])) return;

    var {
        device_code
    } = req.query;
    try {
        if (!device_code) throw { code: 400, message: "device_code is required." }
        let device = await Device.findOne({ code: device_code }).lean()

        if (!device) throw { code: 404, message: "Device was not found." }
        let slideshow = await Slideshow.findOne({ device: device._id }).lean()

        //OK RESPONSE
        res.validSend(200, {
            slideshow
        });
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}
export let addPhoto = async (req, res) => {
    req.validate(["url", "slideshowid"]);

    var {
        url, slideshowid
    } = req.body;
    try {

        let slideshow = await Slideshow.findOneAndUpdate({ _id: slideshowid },
            { $push: { photos: url } }, { new: true }).lean()
        if (!slideshow) throw { code: 404, message: "Slideshow was not found." }
        let device = await Device.findOne({ _id: slideshow.device })
        io.to(device.socketid).emit("slideshow",slideshow)


        //OK RESPONSE
        res.validSend(200, {
            slideshow
        });
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}
/*          POST /api/users/login            */
export let login = async (req, res, next) => {
    //REQUEST VALIDATION    
    req.validate(["username", "password"]);

    var {
        username,
        password
    } = req.body;
    try {
        //FINDING USER
        var user = await User.findOne({
            username
        });
        //AUTHENTICATING USER
        var authenticated = await User.authorize({
            _id: user._id,
            password
        });

        //GENERATING TOKEN
        if (authenticated)
            var token = await tokenize(user._id);

        //OK RESPONSE
        res.validSend(200, {
            authenticated,
            token
        })
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}
/*          POST /api/users/me            */
export let me = async (req, res) => {
    //OK RESPONSE
    res.validSend(200, req.user);
}