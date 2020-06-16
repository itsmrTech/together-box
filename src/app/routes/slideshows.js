/**
 *          .::USER ROUTES::.
 * All User's apis are routed here.
 * 
 */
const routes = express.Router();
import {pushApis} from "../middlewares/ExpressPlugins"
import Auth from '../middlewares/Auth';

import { details, addPhoto } from "../controllers/SlideshowsController";

//ENDPOINTS
routes.get('/', details);
routes.post('/photo', addPhoto);



pushApis("/slideshows",routes)
export default routes;