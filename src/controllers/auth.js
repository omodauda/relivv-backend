import Auth from '../models/auth';
import User from '../models/user';
import Volunteer from '../models/volunteer';

import config from '../config';

import JWT from 'jsonwebtoken';
import { async } from 'regenerator-runtime';

//sign user with token
const signToken = (user) => {
    return JWT.sign({
        iss: 'relivv',
        sub: user.id,
        role: user.role,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 10)
    },
    config.jwtSecret
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

        //sign auth token
        // const token = signToken(newUser);

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
        const {username, email, password, first_name, last_name, phone} = req.body;

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
            phone
        });

        await profile.save();

        //sign auth token
        // const token = signToken(newUser);

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
}


export {registerUser, registerVolunteer}