import Device from "./models/Device";
import uniqid from "uniqid"
import Slideshow from "./models/Slideshow";
export default async () => {

    io.on('connection', async(socket) => {
        console.log('a user connected',socket.id);
        io.to(socket.id).emit("hand-shake",{timestamp:Date.now()})
        socket.on("hand-shake",async(data)=>{
            if(!data.panel){

                let device=await Device.findOneAndUpdate({code:data.device_code},{socketid:socket.id}).lean()
                let slideshow=await Slideshow.findOne({device:device._id}).lean()
                
                io.to(socket.id).emit("slideshow",slideshow)
            }
            
            setInterval(()=>{
                let d={timestamp:Date.now(),id:uniqid()}
                io.to(socket.id).emit("you-there",d)
            },5000)
            socket.on("im-here",async(data)=>{
                console.log("pong!",data)
            })
        })
        socket.on("voip-signal",async(data)=>{
            let device=await Device.findOne({code:data.device_code})
            if(!device)return
            io.to(device.socketid).emit("signal",data.signal)
        })
        socket.on("signal",async(signal)=>{
            io.emit("voip-peering",signal)
        })
    });
}