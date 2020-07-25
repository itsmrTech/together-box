/**
 *          .::GLOBAL VARIABLES::. 
 * 
 */
export default {
    apis:[],
    rand:(min=0,max)=>{
        return Math.floor((Math.random() * (max-min)) + min);
    },
    sleep: function sleep(ms) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, ms);
        });
    },
    redisConfig: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_URL
    }
    //Add global variables here
}