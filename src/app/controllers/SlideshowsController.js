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
import Socket from '../models/Socket';
import { upload } from '../../tools/storage';
import File from "../models/File";
import { encrypt, decrypt } from '../../tools/encryption';
import FileKey from '../models/sensitive/FileKey';


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
        device_unique_name
    } = req.query;
    try {
        // if (!device_unique_name) throw { code: 400, message: "device_unique_name is required." }
        let device
        if (!device_unique_name) {
            let devices = await Device.find({ "users.user": req.user._id }).lean()
            if (devices.length > 1) throw { code: 409, message: "User has more than one device." }
            if (devices.length < 1) throw { code: 404, message: "No device was found." }
            device = devices[0]
        }
        else device = await Device.findOne({ unique_name: device_unique_name, "users.user": req.user._id }).lean()

        if (!device) throw { code: 404, message: "Device was not found." }
        let slideshow = await Slideshow.findOne({ device: device._id }).lean()
        //OK RESPONSE
        res.validSend(200, {
            slideshow,
            device
        });
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}

export let uploadPhotosToSlideshow = async (req, res) => {
    // req.validate(["username", "password"]);

    var {
        device_unique_name
    } = req.body;
    try {
        
        let device = await Device.findOne({ unique_name: device_unique_name, "users.user": req.user._id }).lean()
        if (!device) throw { code: 404, message: "Device was not found." }
        let fileids=[]
        for (var i = 0; i < req.files.length; i++) {
            let f = req.files[i]
            let fileObj= await (new File({
                local_path: f.path,
                uploader:req.user._id,
                device:device._id,
            })).save()
            let fileKey=await  (new FileKey({
                file:fileObj._id,
            })).save()
            await encrypt(f.path,`${f.path}.encrypted`,fileKey.key)
            await decrypt(`${f.path}.encrypted`,`${f.path}.decrypted`,fileKey.key)
            upload(`${f.path}.encrypted`,fileObj._id,f.filename)
            fileids.push(fileObj._id)
        }
        let slideshow = await Slideshow.findOne({ device: device._id }).lean();
        if (!slideshow) slideshow = await (new Slideshow({ photos: [], device: device._id, })).save()
        console.log(slideshow, fileids)
        await Slideshow.updateOne({ _id: slideshow._id }, { photos: [...fileids, ...slideshow.photos] })

        slideshow.photos = [...fileids, ...slideshow.photos]
        let sockets = await Socket.find({ device: device._id }).lean()
        sockets.map(s => {
            io.to(s.socketid).emit("slideshow", { slideshow, device })
        })
        //OK RESPONSE
        res.validSend(200, {
            slideshow,
            device
        })
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
        io.to(device.socketid).emit("slideshow", { device, slideshow })


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