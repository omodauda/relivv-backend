import express from 'express';
const router = express.Router();

import {registerUser} from '../controllers/auth'

router
    .route('/register/user')
    .post(registerUser)



export default router;