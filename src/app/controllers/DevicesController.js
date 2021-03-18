/**
 *          .::USER CONTROLLER::.
 * All related operations to User belong here. 
 * 
 */
import User from '../models/User';
import tokenize from '../middlewares/Token'
import ErrorHandler from '../middlewares/ErrorHandler';
import Device from '../models/Device';
import Performance from '../models/Performance';
import Slideshow from '../models/Slideshow';
import AuthCode from '../models/AuthCode';
import moment from 'moment';
import codes, { genDUN } from '../../tools/codes';


export const genPairingCode = async (device_code) => {
    let device = await Device.findOne({ code: device_code }).lean()
    if (!device) throw { code: 404, message: "Device was not found." }

    let codeObj = await AuthCode.findOneAndUpdate({ device: device._id, type: "pairing" }, {
        expireAt: moment().add(10, "minutes").format(),
        device: device._id,
        type: "pairing",
        code: await codes.pairing(),
    }, { new: true, upsert: true })
    return codeObj
}
export const pairingCode = async (req, res) => {
    req.validate(["device_code"], [], { platform: "query" })
    var {
        device_code
    } = req.query;
    try {
        let codeObj = await genPairingCode(device_code)
        return res.validSend(200, { code: codeObj.code, expireAt: code.expireAt })
    }
    catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}
(async () => { console.log(await genDUN()) })()
export let getDevice = async (req, res) => {
    console.log("hello")
    //REQUEST VALIDATION
    req.validate(["device_unique_name"], [], { platform: "query" });

    var {
        device_unique_name
    } = req.query;
    try {
        let device = await Device.findOne({ unique_name: device_unique_name, "users.user": req.user._id })
        if (!device) throw { code: 404, message: "Device was not found." }
        return res.validSend(200, { device })
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}
export let setDeviceName = async (req, res) => {
    req.validate(["device_unique_name", "name"]);

    var {
        device_unique_name, name
    } = req.body;
    try {
        let device = await Device.findOneAndUpdate({ unique_name: device_unique_name, "users.user": req.user._id }, { name }, { new: true })
        if (!device) throw { code: 404, message: "Device was not found." }
        io.to(device.socketid).emit("setup-name", { device })
        let slideshow = await Slideshow.findOneAndUpdate({ device: device._id, }, { device: device._id }, { new: true, upsert: true }).lean()
        if (!slideshow.photos) {
            slideshow.photos = []
            await Slideshow.updateOne({ _id: slideshow._id }, { photos: [] })
        }
        slideshow.photos=slideshow.photos.map(photo=>`${process.env.STORAGE_URL}/${photo.code}`)
        setTimeout(async () => {

            io.to(device.socketid).emit("slideshow", { device, slideshow })
        }, 5000)
        return res.validSend(200, { device })
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}
/*          POST /api/users/register            */
export let pairDevice = async (req, res, next) => {
    //REQUEST VALIDATION
    req.validate(["pairing_code"]);

    var {
        pairing_code
    } = req.body;
    try {
        // let device = await Device.findOne({ code: device_code }).lean()
        // if (!device) throw { code: 404, message: "Device was not found." }
        let codeObj = await AuthCode.findOne({ code: pairing_code, type: "pairing", expireAt: { $gte: Date.now() } }).lean()
        if (!codeObj) throw { message: "Pairing Code is incorrect", code: 400 }

        let device = await Device.findOne({ _id: codeObj.device, owner: null }).lean()
        await AuthCode.deleteOne({ _id: codeObj._id })
        if (!device) throw { code: 404, message: "Device was not found." }
        await Device.updateOne({ _id: codeObj.device }, { owner: req.user._id, users: [{ user: req.user._id }] })
        io.to(device.socketid).emit("setup-paired", { user: req.user })
        return res.validSend(200, { message: "Enjoy your device;)", device })
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }

}
export let updateDevicePerformance=async(req,res)=>{
    req.validate(["device_code"]);
    let {device_code,performance}=req.body;
    try {
        let device=await Device.findOneAndUpdate({code:device_code},{current_performance:{date:Date.now(),...performance}}).lean()
        if(!device)throw {code:404,message:"Device was not found."}
        await (new Performance({
            device:device._id,
            ...performance
        })).save()
        return res.validSend(200,{message:"The device performance has been updated successfully."})
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}