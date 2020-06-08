/**
 *          .::MAIN FILE::.
 * 
 * 
 */
import vars from "./globals";
import voip from "./app/voip/server"
import './config/env';
import didYouMean from "didyoumean"
didYouMean.returnWinningObject = true;
didYouMean.threshold = 0.5;

import Project from './config/project';
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
app.use(cors());
app.use(ExpressPlugins);

// Routes
routes.post('/', (req, res) => res.json({
  message: Project.Name + ' API'
}));
app.use('/', routes);
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


app.listen(port, (err) => {
  if (err) {
    console.error(err)
  }

  console.info(`listening on port`, Number(port))
});
