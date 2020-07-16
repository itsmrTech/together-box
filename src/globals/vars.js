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
    }
    //Add global variables here
}