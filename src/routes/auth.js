import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportLogin = passport.authenticate('local', {session: false});
const passportGoogle = passport.authenticate('google', {session: false});

import {validateBody, schemas} from '../validators';
import {multerFileUpload} from '../utils/multer';

import {
    registerUser, 
    registerVolunteer, 
    verifyUser,
    googleOauth,
    login,
    forgetPassword
} from '../controllers/auth'

router
    .route('/register/user')
    .post(validateBody(schemas.userSchema), registerUser)

router
    .route('/register/volunteer')
    .post(multerFileUpload.single('file'), registerVolunteer)

router
    .route('/verify/:email')
    .get(verifyUser)

router
    .route('/auth/google')
    .post(passportGoogle, googleOauth)

router
    .route('/login')
    .post(validateBody(schemas.loginSchema), passportLogin, login)

router
    .route('/forget-password')
    .post(forgetPassword)



export default router;