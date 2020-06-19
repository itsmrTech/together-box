/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
import users from './users';
import slideshows from './slideshows';
import devices from './devices';

//USING ROUTES
routes.use('/users', users);
routes.use('/devices', slideshows);
routes.use('/devices', devices);

export default routes;