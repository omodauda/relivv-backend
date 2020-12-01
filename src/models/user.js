import mongoose from 'mongoose';
const schema = mongoose.Schema;
import {Profile} from './profile';

const User = Profile.discriminator('User', new schema({

    avatar: {
        image:{
            type: String
        },
        cloundinary_id:{
            type: String
        }
    },
    first_name:{
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    }

}, {timestamps: true}));

export default User;