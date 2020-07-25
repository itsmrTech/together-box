/**
 *          .::MAIN FILE::.
 * 
 * 
 */
import socketio from "socket.io"
import vars from "./globals";
import http from "http"
import socketController from "./app/socket"
import cron from "./tools/cron"
// import voip from "./app/voip/server"
import fs from "fs"
import './config/env';
import didYouMean from "didyoumean"
import kue from "kue"
import kui from "kue-ui"
import cookieParser from "cookie-parser"

didYouMean.returnWinningObject = true;
didYouMean.threshold = 0.5;

import Project from './config/project';
import storage from "./tools/storage";
if (process.env.projectMode == "Production") {
  //Don't print logs in production mode
  console.config({
    activeLevel: 2
  })
}
//STARTUP
console.intro({
  Name: Project.Name,
  Description: Project.Description,
  Notes: Project.Notes,
  Mode: process.env.projectMode,
  logo:Project.Name
});

import './config/database';
import routes from './app/routes';
import cors from 'cors';
import ExpressPlugins from './app/middlewares/ExpressPlugins';

const app = express();


// Middlewares\
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(ExpressPlugins);
kui.setup({
  apiURL: '/kapi', // IMPORTANT: specify the api url
  baseURL: '/kue', // IMPORTANT: specify the base url
  updateInterval: 5000 // Optional: Fetches new data every 5000 ms
});
// Mount kue JSON api
app.use('/kapi', kue.app);
// Mount UI
app.use('/kue', kui.app);
// Routes
routes.post('/', (req, res) => res.json({
  message: Project.Name + ' API'
}));
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
  let error={error:"Not Found",}

  if(process.env.projectMode=="Development"){
    let similar=didYouMean(process.env.API_PREFIX+req.originalUrl,globals.apis,"path")
    if(similar)error.didYouMean=similar
  }
  return res.status(404).json(error)
});


const port = process.env.API_PORT || 3000;

let httpServer = http.createServer(app);
global.io=socketio(httpServer)
httpServer.listen(port,(err)=>{
  if (err) {
    console.error(err)
  }

  console.info(`listening on port`, Number(port))
});
socketController()
