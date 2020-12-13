import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportJWT = passport.authenticate('jwt', {session: false});

import {
    uploadPhoto,
    updateProfile
} from '../controllers/profile';

import {multerImageUpload} from '../utils/multer';
import {validateBody, schemas} from '../validators';

router
    .route('/upload-photo')
    .post(passportJWT, multerImageUpload.single('image'), uploadPhoto)

router
    .route('/update')
    .patch(validateBody(schemas.updateProfileSchema), passportJWT, updateProfile);






export default router;