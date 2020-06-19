/**
 *          .::GLOBAL VARIABLES::. 
 * 
 */
export default {
    apis:[],
    rand:(min=0,max)=>{
        return Math.floor((Math.random() * (max-min)) + min);
    }
    //Add global variables here
}