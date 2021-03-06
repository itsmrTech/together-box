/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
import users from './users';
import slideshows from './slideshows';
import devices from './devices';
import files from './files';

//USING ROUTES
routes.use('/users', users);
routes.use('/slideshows', slideshows);
routes.use('/devices', devices);
routes.use('/files', files);

export default routes;