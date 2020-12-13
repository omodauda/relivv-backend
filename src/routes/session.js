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

import {accessControl} from '../middlewares';
import {validateBody, schemas} from '../validators';

router
    .route('/book-session')
    .post(validateBody(schemas.bookSessionSchema), passportJWT, accessControl('User', 'Admin'), bookSession)

router
    .route('/:id/assign-volunteer')
    .patch(validateBody(schemas.assignVolunteer), accessControl('Admin', 'SuperAdmin'), assignVolunteer)

router
    .route('/:id/volunteer-response')
    .patch(validateBody(schemas.volunteerResponseSchema), passportJWT, accessControl("Volunteer"), volunteerResponse)








export default router;