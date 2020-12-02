import Auth from '../models/auth';
import User from '../models/user';
import Volunteer from '../models/volunteer';

import config from '../config';

import JWT from 'jsonwebtoken';

//utils
import {sendVerificationEmail} from '../utils/email';
import { async } from 'regenerator-runtime';

//sign user with token
const signToken = (user) => {
    return JWT.sign({
        iss: 'relivv',
        sub: user.id,
        role: user.role,
        iat: new Date().getTime(),
        // exp: new Date().setDate(new Date().getDate() + 10)
    },
    config.jwtSecret,
    {expiresIn: '10d'}
    );
};

const registerUser = async(req, res) => {
    try{
        const {username, email, password, role, first_name, last_name, phone} = req.body;

        const newUser = new Auth({
            method: "local",
            local: {
                username,
                email,
                password
            },
            role,
        });

        await newUser.save();

        const profile = new User({
            authId: newUser.id,
            first_name,
            last_name,
            phone
        });

        await profile.save();

        //send verification link
        await sendVerificationEmail(newUser.local.email);

        res
        .status(201)
        .json({
            status: "success",
            message: "user successfully created"
        })
    }catch(error){
        res
        .status(400)
        .json({
            status: "fail",
            error: error.message
        })
    }
};

const registerVolunteer = async(req, res) => {
    try{
        const {
            username, email, password, first_name, last_name, designation,
            gender, experience_year, professional_career, education_level, phone
        } = req.body;

        const newUser = new Auth({
            method: "local",
            local: {
                username,
                email,
                password
            },
            role: 'Volunteer',
        });

        await newUser.save();

        const profile = new Volunteer({
            authId: newUser.id,
            first_name,
            last_name,
            designation,
            gender,
            experience_year,
            professional_career,
            education_level,
            phone
        });

        await profile.save();

        //send verification link
        await sendVerificationEmail(newUser.local.email);

        res
        .status(201)
        .json({
            status: "success",
            message: "volunteer successfully created"
        })
    }catch(error){
        res
        .status(400)
        .json({
            status: "fail",
            error: error.message
        })
    }
};

const verifyUser = async(req, res) => {
    try{
        const {email} = req.params;
        const user = await Auth.findOne({$or: [{'local.email': email}, {'google.email': email}]});
        
        if(!user){
            return res
            .status(400)
            .json({
                status: "fail",
                message: `user with email ${email} not registered`
            })
        }

        await Auth.findByIdAndUpdate(user.id, {is_verified: true});

        res
        .status(200)
        .json({
            status: 'success',
            message: "user verification successful!"
        })
    }catch(error){
        res
        .status(400)
        .json({
            status: "fail",
            error: error.message
        })
    }
}

// const login = async(req, res) => {
   
//     try{
//         const {local: {email}, role, id} = req.user;

//         let profile;

//         if(role === 'User'){
//             profile = await User.findOne({authId: id})
//         }else if(role === 'Volunteer'){
//             profile = await Volunteer.findOne({authId: id});
//         }

//         console.log(profile);
//     }catch(error){
//         res
//         .status(400)
//         .json({
//             status: "fail",
//             error: error.message
//         })
//     }
// }


export {registerUser, registerVolunteer, verifyUser}