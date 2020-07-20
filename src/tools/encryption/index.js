import crypto from "crypto";
import fs from "fs"
import AppendInitVect from "./appendIV";
const algorithm = 'aes-256-ctr';


export const encrypt = (input_path, output_path,key) => {
    let hashed_key = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);

    input_path = input_path.replace(/\\/g, "/")
    output_path = output_path.replace(/\\/g, "/")

    return new Promise((resolve, reject) => {

        let input = fs.createReadStream(input_path);
        let output = fs.createWriteStream(output_path);
        const iv = crypto.randomBytes(16);
        console.log("enc iv", iv)
        const cipher = crypto.createCipheriv(algorithm, hashed_key, iv);
        input.pipe(cipher).pipe(new AppendInitVect(iv)).pipe(output);
        output.on('finish', () => {
            console.log("encryption done", output_path);
            resolve();
        })
    })
};

export const decrypt = (input_path, output_path,key) => {
    let hashed_key = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);

    input_path = input_path.replace(/\\/g, "/")
    output_path = output_path.replace(/\\/g, "/")

    return new Promise((resolve, reject) => {

        let output = fs.createWriteStream(output_path);
        const ivStream = fs.createReadStream(input_path, { end: 15 });
        let iv;
        ivStream.on("data", chunk => {
            iv = chunk;
        })
        ivStream.on("close", () => {
            const cipher = crypto.createDecipheriv(algorithm, hashed_key, iv);
            let input = fs.createReadStream(input_path, { start: 16 });
            console.log("dec iv", iv)
            input.pipe(cipher).pipe(output);
            output.on('finish', () => {
                console.log("decryption done", output_path);
                resolve();
            })

        })
    })
};
