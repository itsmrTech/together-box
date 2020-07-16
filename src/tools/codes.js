import AuthCode from "../app/models/AuthCode";
import { uniqueNamesGenerator, adjectives, colors, starWars,names } from 'unique-names-generator';
import Device from "../app/models/Device";
import shortid from "shortid";


export const pairing=async(exclude=[])=>{
    let code=String(globals.rand(1000,9999))
    let found=false;
    exclude.map(num=>{
        if(num==code)return found=true;
    })
    if(found)return await pairing(exclude)
    if(await AuthCode.findOne({type:"pairing",code}).lean()){
        exclude.push(code)
        return await pairing(exclude)
    }
    return code;
}
export const genDUN=async()=>{
    
    let dun=String(uniqueNamesGenerator({
        dictionaries:[adjectives,colors,starWars,names],
        separator:"-"
    }))
    dun=dun.replace(" ","-")
    let found=await Device.countDocuments({unique_name:dun})
    if(found>1)dun=dun+"-"+shortid.generate();


    return dun;
}
export default {pairing,genDUN}