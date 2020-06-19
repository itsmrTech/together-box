/**
 *          .::USER ROUTES::.
 * All User's apis are routed here.
 * 
 */
const routes = express.Router();
import {pushApis} from "../middlewares/ExpressPlugins"
import Auth from '../middlewares/Auth';

import { genPairingCode, pairDevice, pairingCode } from "../controllers/DevicesController";

//ENDPOINTS
routes.get('/pair/code', pairingCode);
routes.post('/pair',Auth, pairDevice);


pushApis("/devices",routes)
export default routes;