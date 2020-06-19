import AuthCode from "../app/models/AuthCode";

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

export default {pairing}