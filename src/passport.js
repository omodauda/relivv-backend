import passport from 'passport';
import {Strategy as JwtStrategy} from 'passport-jwt';
import {ExtractJwt} from 'passport-jwt';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as GoogleStrategy} from 'passport-google-token';
import { async } from 'regenerator-runtime';
import Auth from './models/auth';
import User from './models/user';

import config from './config';
import {sendVerificationEmail} from './utils/email';


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
));

//Google strategy
passport.use(
    "google",
    new GoogleStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret
    },
    async(accessToken, refreshToken, profile, done) => {
        try{
            //details from google
            const {id, email, verified_email, given_name: first_name, family_name: last_name, picture} = profile._json;

            //check if user with same gmail already exist. If yes, return the user
            const existingUser = await Auth.findOne({'google.id': id});
            if(existingUser){
                return done(null, existingUser)
            }

            //check if user has signed up locally before
            const foundUser = await Auth.findOne({'local.email': email});

            if(foundUser){
                //merge google data with local auth
                foundUser.methods.push('google');
                foundUser.google = {
                    id,
                    email
                };
                await foundUser.save();
                return done(null, foundUser)
            };

            //create user object
            const user = new Auth({
                methods: ['google'],
                google: {
                    id,
                    email
                }
            });
            await user.save();

            //user profile
            const userProfile = new User({
                authId: user.id,
                avatar: {
                    image: picture
                },
                first_name,
                last_name
            });
            await userProfile.save();

            await sendVerificationEmail(email);

            //return user
            return done(null, user)

        }catch(error){
            return done(error, false);
        }
    })
)