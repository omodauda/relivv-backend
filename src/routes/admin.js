import express from 'express';
const router = express.Router();

import {
    acceptVolunteer,
    declineVolunteer
} from '../controllers/admin';


router
    .route('/accept-volunteer/:id')
    .patch(acceptVolunteer)

router
    .route('/decline-volunteer/:id')
    .patch(declineVolunteer)




export default router;