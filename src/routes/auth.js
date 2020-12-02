import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportLogin = passport.authenticate('local', {session: false});
const passportGoogle = passport.authenticate('google', {session: false});

import {validateBody, schemas} from '../validators';

import {
    registerUser, 
    registerVolunteer, 
    verifyUser,
    googleOauth
} from '../controllers/auth'

router
    .route('/register/user')
    .post(validateBody(schemas.userSchema), registerUser)

router
    .route('/register/volunteer')
    .post(validateBody(schemas.volunteerSchema), registerVolunteer)

router
    .route('/verify/:email')
    .get(verifyUser)

router
    .route('/auth/google')
    .post(passportGoogle, googleOauth)

// router
//     .route('/login')
//     .post(passportLogin, login)



export default router;