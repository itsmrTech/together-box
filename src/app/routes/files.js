/**
 *          .::USER ROUTES::.
 * All User's apis are routed here.
 * 
 */
const routes = express.Router();
import {pushApis} from "../middlewares/ExpressPlugins"
import Auth, { optionalAuth, deviceAuth } from '../middlewares/Auth';
import { getFile } from "../controllers/FilesController";


//ENDPOINTS
routes.get('/:file_code', getFile);


pushApis("/files",routes)
export default routes;