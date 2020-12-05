import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportJWT = passport.authenticate('jwt', {session: false});

import {
    bookSession,
    // assignVolunteer
} from '../controllers/session';

router
    .route('/book')
    .post(passportJWT, bookSession)

// router
//     .route('/:id/assign-volunteer')
//     .patch(assignVolunteer)











export default router;