/**
 *          .::USER ROUTES::.
 * All User's apis are routed here.
 * 
 */
const routes = express.Router();
import {pushApis} from "../middlewares/ExpressPlugins"
import Auth from '../middlewares/Auth';
import mime from "mime-types"

import { details, addPhoto, uploadPhotosToSlideshow } from "../controllers/SlideshowsController";
import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files')
    },
    filename: (req, file, cb) => {
        if (file.mimetype.slice(0, 5) !== 'image' && file.mimetype.slice(0, 5) !== 'video')
            return cb('file format is not supported', false);
        let fileName = 'together_cdn_' + Date.now() + '.' + mime.extension(file.mimetype);
        cb(null, fileName)
    }
});
const uploader = multer({ storage: storage });
//ENDPOINTS
routes.get('/',Auth, details);
routes.post('/photo', addPhoto);
routes.post('/photo/upload',Auth,uploader.any(), uploadPhotosToSlideshow);



pushApis("/slideshows",routes)
export default routes;