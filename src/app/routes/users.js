/**
 *          .::USER ROUTES::.
 * All User's apis are routed here.
 * 
 */
const routes = express.Router();
import {pushApis} from "../middlewares/ExpressPlugins"
import Auth from '../middlewares/Auth';
import {
	register,
	login,
	me
} from '../controllers/UsersController'

//ENDPOINTS
routes.post('/register', register);
routes.post('/login', login);
routes.get('/me', Auth, me);


pushApis("/users",routes)
export default routes;