import express from 'express';
const router = express.Router();
import passport from 'passport';
import passportConf from '../passport';
const passportJWT = passport.authenticate('jwt', {session: false});

import {accessControl} from '../middlewares'
import {validateBody, schemas} from '../validators'

import {registerAdmin} from '../controllers/superAdmin';


router
    .route('/register-admin')
    .post(validateBody(schemas.userSchema), passportJWT, accessControl('SuperAdmin'), registerAdmin)




export default router;