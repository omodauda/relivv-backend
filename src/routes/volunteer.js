import express from 'express';
const router = express.Router();

import {getActiveVolunteers} from '../controllers/volunteer';


router
    .route('/')
    .get(getActiveVolunteers)






export default router;