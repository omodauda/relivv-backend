import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportLogin = passport.authenticate('local', {session: false});

import {registerUser, registerVolunteer, verifyUser} from '../controllers/auth'

router
    .route('/register/user')
    .post(registerUser)

router
    .route('/register/volunteer')
    .post(registerVolunteer)

router
    .route('/verify/:email')
    .get(verifyUser)
// router
//     .route('/login')
//     .post(passportLogin, login)



export default router;