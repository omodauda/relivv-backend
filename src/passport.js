import passport from 'passport';
import {Strategy} from 'passport-jwt'
import {ExtractJwt} from 'passport-jwt'
import {Strategy as LocalStrategy} from 'passport-local'
import { async } from 'regenerator-runtime';
import Auth from './models/auth';

//local strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    async(email, password, done) => {
        try{
            const user = await Auth.findOne({'local.email': email});

            // const user = await Auth.findOne({$or: [{'local.email': email}, {'local.username': username}]});

            if(!user){
                return done(new Error('Invalid email'), false);
            }

            //check if the password is correct
            const isMatch = await user.isValidPassword(password);
            //if password is invalid return error
            if(!isMatch){
                return done(new Error('Invalid password'), false);
            }
            //if password is valid, return user
            done(null, user)
        }catch(error){
            return done(error, false);
        }
    }
))