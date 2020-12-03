import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportJWT = passport.authenticate('jwt', {session: false});

import {uploadPhoto} from '../controllers/profile';

import {multerImageUpload} from '../utils/multer';

router
    .route('/upload-photo')
    .post(passportJWT, multerImageUpload.single('image'), uploadPhoto)








export default router;