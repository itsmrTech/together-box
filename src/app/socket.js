import Device from "./models/Device";
import uniqid from "uniqid"
import Slideshow from "./models/Slideshow";
import { genPairingCode } from "./controllers/DevicesController";
import Socket from "./models/Socket";
import Weather from "./models/Weather";
import fs from "fs"
// (async()=>{
//     let urls=fs.readdirSync("public/uploads/memory").map(f=>`https://192.168.0.149:4020/uploads/memory/${f}`)
//     let slideshow=await Slideshow.findOne({device:"5ee1dbfd07e4ea7964ccc1cd"}).lean()
//     await Slideshow.updateOne({_id:slideshow._id},{photos:[...urls,...slideshow.photos]})
// })()
export default async () => {
    await Socket.deleteMany({});
    io.on('connection', async (socket) => {
        let _socket=await Socket.findOneAndUpdate({socketid:socket.id},{socketid:socket.id},{new:true,upsert:true})
        console.log('a user connected', socket.id);
        io.to(socket.id).emit("hand-shake", { timestamp: Date.now() })
        socket.on("hand-shake", async (data) => {
            if (!data.panel) {

                let device = await Device.findOneAndUpdate({ code: data.device_code }, { socketid: socket.id }).lean()
                if(!device)return;

                let weather=await Weather.findOne({city_name:device.city,country_code:device.country}).lean()
                io.to(socket.id).emit("weather",{
                    weather:weather.weather,
                    app_temp:weather.app_temp,
                    temp:weather.temp
                })
                _socket=await Socket.findOneAndUpdate({socketid:socket.id},{device:device._id})
                if (device.owner) {
                    let slideshow = await Slideshow.findOne({ device: device._id }).lean()
                    if(!slideshow)slideshow={photos:[]}
                    if(!slideshow.photos)slideshow.photos=[]
                    io.to(socket.id).emit("slideshow", {slideshow,device})
                }
                else {
                    let result = await genPairingCode(device.code)
                    io.to(socket.id).emit("setup-pairing",{code:result.code,expireAt:result.expireAt})
                }
            }

            setInterval(() => {
                let d = { timestamp: Date.now(), id: uniqid() }
                io.to(socket.id).emit("you-there", d)
            }, 5000)
            socket.on("im-here", async (data) => {
                console.log("pong!", data)
            })
        })
        socket.on("voip-signal", async (data) => {
            console.log("voip-signal",data)
            let device = await Device.findOne({ unique_name: data.device_unique_name })
            if (!device) return
            let sockets=await Socket.find({device:device._id}).lean()
            sockets.map(s=>{
                io.to(s.socketid).emit("signal", {signal:data.signal,panelid:_socket._id})
            })
        })
        socket.on("signal", async (data) => {
            let {signal,panelid}=data;
            let socketObj=await Socket.findOne({_id:panelid}).lean()
            console.log("signal",socketObj)
            if(!socketObj)return;
            io.to(socketObj.socketid).emit("voip-peering", {signal,})
        })
    });
}