import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path'

abstract class Controller {
    abstract intializeRoutes(): any;
    public router = express.Router();
    public storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname))
        }
    })
}

export default Controller;
