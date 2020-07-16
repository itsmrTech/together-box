import schedule from "node-schedule";
import Axios from "axios";
import Weather from "../app/models/Weather";
import Device from "../app/models/Device";
import Socket from "../app/models/Socket";
const checkForecast = async (country, city) => {
    try {
        let response = await Axios.get(`https://api.weatherbit.io/v2.0/current?city=${city}&country=${country}&key=${process.env.WEATHERBIT_KEY}`)
        console.log("resp",`https://api.weatherbit.io/v2.0/current?city=${city}&country=${country}&key=${process.env.WEATHERBIT_KEY}`,response.data)
        let weatherInfo = response.data.data[0]
        await Weather.updateOne({ country_code: weatherInfo.country_code, city_name: weatherInfo.city_name }, weatherInfo, { upsert: true });
        return weatherInfo
    } catch (e) {
        console.error(e)
    }
}
const updateAllWeathers = async () => {
    try {
        let weathers = await Weather.find({}).lean()
        for (var i = 0; i < weathers.length; i++) {
            await globals.sleep(globals.rand(5000, 30000))
            let newWeather = await checkForecast(weathers[i].country_code, weathers[i].city_name);
            let devices = await Device.find({ country: newWeather.country_code, city: newWeather.city_name }).lean();
            let deviceids = devices.map(d => d._id)
            let sockets = await Socket.find({ device: { $in: deviceids } })
            console.log(deviceids,sockets)
            sockets.map(s => {
                console.log("socket",s)
                io.to(s.socketid).emit("weather", { weather: newWeather.weather, app_temp: newWeather.app_temp, temp: newWeather.temp })
            })
        }
        

    } catch (e) {
        console.error(e)
    }
}
setTimeout(() => {

    updateAllWeathers()
}, 1000)
schedule.scheduleJob('* */2 * * *', async () => {
    updateAllWeathers()
});
