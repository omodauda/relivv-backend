import express from 'express';
const router = express.Router();

import {acceptVolunteer} from '../controllers/admin';


router
    .route('/accept-volunteer/:id')
    .patch(acceptVolunteer)






export default router;