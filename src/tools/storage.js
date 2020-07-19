import kue from "kue"
import File from "../app/models/File";
import fs from "fs"
let queue = kue.createQueue({ prefix: "together" })
const ftp = require("basic-ftp");
(["ftp"]).map(a => {
    kue.Job.rangeByType(a, "active", 0, 1000000, 'asc', function (err, selectedJobs) {
        console.log(selectedJobs.length)
        selectedJobs.forEach(function (job) { job.inactive() });
        kue.Job.rangeByType(a, "inactive", 0, 1000000, 'asc', function (err, selectedJobs) {
            console.log(selectedJobs.length)
            selectedJobs.forEach(function (job) { job.remove() });
        });
    });
})
const client = new ftp.Client();
let status = "closed"
export const connect = async () => {
    status = "connecting"
    client.ftp.verbos = true
    await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
        secure: false
    })
    status = "connected"
}
connect()
queue.process("ftp", async (job, done) => {

    switch (job.data.type) {
        case "upload":
            let { local_path, upload_path ,fileid} = job.data
            await _upload(local_path, fileid, upload_path)
        default:
    }
    done()
})
let _upload = async (local_path, fileid, upload_path) => {
    try {
        while (status != "connected") {
            await globals.sleep(2000)
        }
        console.log("local",local_path,fs.existsSync(local_path))
        await client.uploadFrom(local_path, "together/" + upload_path)
        fs.unlink(local_path,()=>{})
        await File.updateOne({ _id: fileid }, {
            storage_path: "together/" + upload_path,
            access_url:"http://storage.itsmrtech.ir/together/"+upload_path,
            status:"uploaded",
        })
    } catch (e) {
        console.error(" FTP Error", e)
        await connect()
        // return await _upload(local_path,fileid, upload_path)
    }
}
console.log("fs",fs.readdirSync("files/test"))
export const upload = async (local_path, fileid, upload_path) => {
    local_path=local_path.replace(/\\/g,"/")
    if (!upload_path) upload_path = local_path
    queue.create("ftp", { type: "upload", local_path, upload_path, fileid }).save(() => { })
}
export default { upload } 