/**
 *          .::USER ROUTES::.
 * All User's apis are routed here.
 * 
 */
const routes = express.Router();
import {pushApis} from "../middlewares/ExpressPlugins"
import Auth, { deviceAuth } from '../middlewares/Auth';

import { genPairingCode, pairDevice, pairingCode, getDevice, setDeviceName,updateDevicePerformance } from "../controllers/DevicesController";

//ENDPOINTS
routes.get('/',Auth, getDevice);
routes.get('/pair/code', pairingCode);
routes.post('/pair',Auth, pairDevice);
// routes.post('/stats',deviceAuth, pairDevice);
routes.post('/stats', updateDevicePerformance);
routes.put('/name',Auth, setDeviceName);


pushApis("/devices",routes)
export default routes;