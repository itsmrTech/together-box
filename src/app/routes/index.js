/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
import users from './users';
import slideshows from './slideshows';

//USING ROUTES
routes.use('/users', users);
routes.use('/slideshows', slideshows);

export default routes;