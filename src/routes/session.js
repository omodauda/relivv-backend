import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportJWT = passport.authenticate('jwt', {session: false});

import {
    bookSession,
    assignVolunteer,
    volunteerResponse
} from '../controllers/session';

import {accessControl} from '../middlewares/index';

router
    .route('/book')
    .post(passportJWT, bookSession)

router
    .route('/:id/assign-volunteer')
    .patch(assignVolunteer)

router
    .route('/:id/volunteer-response')
    .patch(passportJWT, accessControl("Volunteer"), volunteerResponse)








export default router;