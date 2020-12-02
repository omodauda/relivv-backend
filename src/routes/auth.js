import express from 'express';
const router = express.Router();

import {registerUser, registerVolunteer} from '../controllers/auth'

router
    .route('/register/user')
    .post(registerUser)

router
    .route('/register/volunteer')
    .post(registerVolunteer)

export default router;