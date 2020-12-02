import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportLogin = passport.authenticate('local', {session: false});

import {validateBody, schemas} from '../validators';

import {registerUser, registerVolunteer, verifyUser} from '../controllers/auth'

router
    .route('/register/user')
    .post(validateBody(schemas.userSchema), registerUser)

router
    .route('/register/volunteer')
    .post(validateBody(schemas.volunteerSchema), registerVolunteer)

router
    .route('/verify/:email')
    .get(verifyUser)
// router
//     .route('/login')
//     .post(passportLogin, login)



export default router;