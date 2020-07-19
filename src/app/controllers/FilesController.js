
import File from "../models/File"
import ErrorHandler from "../middlewares/ErrorHandler";
import Device from "../models/Device";
export const getFile = async (req, res) => {
    req.validate(["file_code"], [], { platform: "params" })

    try {
        if (!req.user && !req.device) throw { code: 401, message: "Unauthorized" }
        let { file_code } = req.params;

        let fileObj = await File.findOne({ code: file_code, status: { $ne: "deleted" } }).lean();
        if (!fileObj) throw { code: 404, message: "File was not found.", tag: 1 }

        if (req.user) {
            if (req.headers.device_unique_name)
                req.device = await Device.findOne({ "users.user": req.user._id, unique_name: req.headers.device_unique_name }).lean();
            else {
                let devices=await Device.find({"users.user":req.user._id,status:"active"})
            }
        }

        if (req.device) {
            if (String(req.device._id) != String(fileObj.device)) throw { code: 404, message: "File was not found", tag: 2 }
        }



    }
    catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}