import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportJWT = passport.authenticate('jwt', {session: false});

import {accessControl} from '../middlewares'

import {
    getAllVolunteers,
    acceptVolunteer,
    declineVolunteer,
    suspendVolunteer
} from '../controllers/admin';


router
    .route('/volunteers')
    .get(passportJWT, accessControl('Admin'), getAllVolunteers)

router
    .route('/accept-volunteer/:id')
    .patch(passportJWT, accessControl('Admin'), acceptVolunteer)

router
    .route('/decline-volunteer/:id')
    .patch(passportJWT, accessControl('Admin'), declineVolunteer)

router
    .route('/suspend-volunteer/:id')
    .patch(passportJWT, accessControl('Admin'), suspendVolunteer)


export default router;