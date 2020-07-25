/**
 *          .::ENVIRONMENT PARSING::.
 * Parsing .env files and defining Project mode(Development, Production)
 * 
 */
import dotenv from "dotenv"
import path from "path"
let dotenvPath = "../../.dev.env"
let projectMode = "Development"
let port;
let docker = false
console.log(process.argv)
process
  .argv
  .forEach((val, index, array) => {
    switch (val) {
      case "--production":
        projectMode = "Production"
        return dotenvPath = '../../.env';
        break;
      case "--docker":
        docker = true
        console.log("docker.env", process.env.PROJECT_MODE)
        if (process.env.PROJECT_MODE == "production") {
          projectMode = "Production"
          return dotenvPath = '../../.env';
        }
        else if (process.env.PROJECT_MODE == "development") {
          projectMode = "Development"
          return dotenvPath = '../../.dev.env';
        }
        break;
      //Add more commands here
      default:
        if (val.indexOf("port=") >= 0)
          port = Number(val.replace("port=", ""))
    }
  });
let override = {}
if (process.env.REDIS_URL) override.REDIS_URL = process.env.REDIS_URL
if (process.env.REDIS_PORT) override.REDIS_PORT = process.env.REDIS_PORT

dotenv.config({
  path: path.resolve(__dirname, dotenvPath),
});
_.mapKeys(override, (v, k) => {
  process.env[k] = v
})
if (port) {
  process.env.API_PORT = port;
  process.env.SOCKET_PORT = port + 1;
}

process.env.projectMode = projectMode;
console.log(process.env.CASSANDRA_URL)
if (!docker) {
  process.env.API_PREFIX = ""
}
