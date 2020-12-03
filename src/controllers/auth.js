import Auth from '../models/auth';
import User from '../models/user';
import Volunteer from '../models/volunteer';

import config from '../config';

import JWT from 'jsonwebtoken';

//utils
import {sendVerificationEmail} from '../utils/email';
import {uploadFile} from '../utils/cloudinary';
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
        const {email, password, role, first_name, last_name, phone} = req.body;

        //check if there's a user with same email
        let foundUser = await Auth.findOne({'local.email': email});
        if(foundUser){
            return res
            .status(403)
            .json({
                status: "fail",
                message: `Email ${email} already in use`
            });
        }

        //check if there's a Google account with same email
        foundUser = await Auth.findOne({'google.email': email});

        if(foundUser){
            //merge them
            foundUser.methods.push('local');
            foundUser.local = {
                email,
                password
            }

            await foundUser.save();

            return res
            .status(201)
            .json({
                status: "success",
                message: "user successfully created"
            })
        };

        const newUser = new Auth({
            methods: ["local"],
            local: {
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

        //return if no file selected
        if (!req.file){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: 'volunteer must provide a certification'
            });
        };

        const {
            email, password, first_name, last_name, designation,
            gender, experience_year, professional_career, education_level, phone
        } = req.body;

        //check if there's a user with same email
        let foundUser = await Auth.findOne({'local.email': email});
        if(foundUser){
            return res
            .status(403)
            .json({
                status: "fail",
                message: `Email ${email} already in use`
            });
        };

        //new volunteer
            //upload certificate to cloudinary
        const file = await  uploadFile(req.file);
        const {public_id, secure_url} = file;

        const newUser = new Auth({
            methods: ["local"],
            local: {
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
            certificate: {
                url: secure_url,
                public_id
            },
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
};

const googleOauth = async(req, res) => {
    try{
        const {id, role, is_verified} = req.user;

        let profile;

        if(role === 'Volunteer'){
            profile = await Volunteer.findOne({authId: id }).select('-authId -__v');
        } else{
            profile = await User.findOne({authId: id}).select('-authId -__v')
        }

        const token = signToken(req.user);
        res
        .status(201)
        .json({
            status: "success",
            message: `${is_verified ? "" : "A verification link has been sent to your gmail, please verify your account"}`,
            data:{
                token,
                profile
            }
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

const login = async(req, res) => {
   
    try{
        const {local: {email}, role, id} = req.user;

        let profile;

        if(role === 'User'){
            profile = await User.findOne({authId: id}).select('-authId -__v')
        }else if(role === 'Volunteer'){
            profile = await Volunteer.findOne({authId: id}).select('-authId -__v');
        }

        const token = signToken(req.user);
        res
        .status(200)
        .json({
            status: 'success',
            message: "login successful",
            data: {
                token,
                profile
            }
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


export {
    registerUser, 
    registerVolunteer, 
    verifyUser, 
    googleOauth,
    login
}