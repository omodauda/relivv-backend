const { async } = require("regenerator-runtime");
import { response } from 'express';
import nodemailer from 'nodemailer';
import config from '../config';

let hostURL = 'https://relivv.herokuapp.com';

if(process.env.NODE_ENV= 'development'){
    hostURL = `http://localhost:${process.env.PORT || 3000}` 
}

const sendMail = async({receipient, subject, html}) => {

    const email = config.nodemailer_email;
    const password = config.nodemailer_password;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });

    const mailOptions = {
        from : `relivv app <${config.nodemailer_email}>`,
        to: receipient,
        subject,
        html
    };

    transporter.sendMail(mailOptions, (err, response) => {
        if(err){
            return err
        }else if(response){
            return response
        }
    })
};

const sendVerificationEmail = async(email) => {
    try{
        const link = `${hostURL}/api/v1/users/verify/${email}`;
        const receipient = email;
        const subject = "Welcome to Relivv! Please Confirm Your Email";
        const html = `
            <div>
                <h2>Welcome to Relivv. A community that cares about your mental health.</h2>
                <h3>click on this link to verify your email: <a href="${link}">verify me</a></h3>
                <h4>You can now login to read amazing tips on mental health or book a session with available volunteers.</h4>
                <h4>Best regards,</h4>
                <h4>Relivv</h4>
            </div>
        `
        await sendMail({receipient, subject, html});

    }catch(error){
        return error;
    }
};

const sendResetPasswordEmail = async(email, id, token) => {
    try{
        const link = `${hostURL}/api/v1/users/${id}/reset-password/${token}`;
        const receipient = email;
        const subject = "Password reset request email";
        const html = `
            <h3>Please click the link to proceed to resetting your password:</h3>
            <a href="${link}">Reset my password</a>
        `;
        await sendMail({receipient, subject, html});
    }catch(error){
        return error;
    }
}

export {
    sendVerificationEmail,
    sendResetPasswordEmail
}