/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
import users from './users';

//USING ROUTES
routes.use('/users', users);

export default routes;