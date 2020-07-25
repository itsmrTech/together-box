
import File from "../models/File"
import ErrorHandler from "../middlewares/ErrorHandler";
import Device from "../models/Device";
import fs from "fs"
import { decrypt } from "../../tools/encryption";
import { download } from "../../tools/storage";
import shortid from "shortid";
import Path from "path"
import FileKey from "../models/sensitive/FileKey";
export const getFile = async (req, res) => {
    req.validate(["file_code"], [], { platform: "params" })

    try {

        if (!req.user && !req.device) throw { code: 401, message: "Unauthorized" }
        let { file_code } = req.params;

        let fileObj = await File.findOne({ code: file_code, status: { $ne: "deleted" } }).lean();
        if (!fileObj) throw { code: 404, message: "File was not found.", tag: 1 }

        if (req.user) {
            if (req.headers.device_unique_name) {
                req.device = await Device.findOne({ "users.user": req.user._id, unique_name: req.headers.device_unique_name }).lean();
                if (!req.device) throw { code: 404, message: "File was not found.", tag: 4 }
            } else {
                let devices = await Device.find({ "users.user": req.user._id, status: "active" }).lean()
                if (!devices.find(d => String(d._id) == String(fileObj.device))) throw { code: 404, message: "File was not found.", tag: 3 }
            }
        }

        if (req.device) {
            if (String(req.device._id) != String(fileObj.device)) throw { code: 404, message: "File was not found", tag: 2 }
        }
        let file_path;
<<<<<<< HEAD
        if (fileObj.status == "local") file_path = fileObj.local_path
        else if (fileObj.status == "uploaded") {
            let fileName=`_${Date.now()}_${shortid.generate()}`
            await download(fileObj.access_url,`/files/${fileName}`)
            await decrypt(`/files/${fileName}`,`/files/decrypted${fileName}`);
            file_path=`/files/decrypted${fileName}`
=======
        let fileName = `_${Date.now()}_${shortid.generate()}`
        if (fileObj.status == "local") file_path = fileObj.local_path
        else if (fileObj.status == "uploaded") {
            let fileKey = await FileKey.findOne({ file: fileObj._id }).lean();
            if (!fileKey) throw { code: 404, message: "File was not found.", tag: 5 }

            await download(fileObj.access_url, `files/${fileName}`)
            await decrypt(`files/${fileName}`, `files/decrypted${fileName}`,fileKey.key);
            file_path = `files/decrypted${fileName}`
>>>>>>> 7a208de1c2c6f16a4bffef1f19f4e5f0bc86e5a7
        }
        res.sendFile(file_path, { root: __rootname, headers: { 'Content-Type': 'image/jpeg' } },()=>{
            if (fs.existsSync(`files/${fileName}`)) fs.unlink(`files/${fileName}`, () => { })
            if (fs.existsSync(`files/decrypted${fileName}`)) fs.unlink(`files/decrypted${fileName}`, () => { })
        })
        return;
    }
    catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}