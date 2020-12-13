import User from '../models/user';
import Auth from '../models/auth';
import {sendVerificationEmail} from '../utils/email'

const registerAdmin = async(req, res) => {
    try{
        const {email, password, first_name, last_name, phone} = req.body;
        //check if a super-admin is sending the request;
        const {role} = req.user;
        if(role !== 'SuperAdmin'){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: 'You are not permitted to perform this action'
            })
        }
        let foundUser = await Auth.findOne({$or: [{'local.email': email}, {'google.email': email}]});
        if(foundUser){
            return res
            .status(400)
            .json({
                status: "fail",
                error: `Email ${email} already in use`
            });
        }

        const newAdmin = new Auth({
            methods: ["local"],
            local: {
                email,
                password
            },
            role: 'Admin',
        });

        await newAdmin.save();

        const profile = new User({
            authId: newAdmin.id,
            first_name,
            last_name,
            phone
        });

        await profile.save();

        //send verification link
        await sendVerificationEmail(newAdmin.local.email);

        res
        .status(201)
        .json({
            status: "success",
            message: "Admin successfully registered"
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
    registerAdmin
}