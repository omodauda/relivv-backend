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
                <a href="${link}">verify me</a>
            </div>
        
        `
        await sendMail({receipient, subject, html});

    }catch(error){
        return error;
    }
}

export {sendVerificationEmail}