import mongoose from 'mongoose';
const schema = mongoose.Schema;
import Profile from './profile';

const Volunteer = Profile.discriminator('Volunteer', new schema({

    authId: {
        type: schema.Types.ObjectId,
        ref: "Auth"
    },
    status:{
        type: String,
        default: 'Reviewing',
        enum: ["Reviewing", "Accepted", "Declined"]
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    avatar:{
        image:{
            type: String
        },
        cloudinary_id:{
            type: String
        }
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Others"]
    },
    phone: {
        type: String,
        required: true
    },
    experience_year: {
        type: Number,
        required: true
    },
    professional_career: {
        type: String,
        required: true
    },
    education_level: {
        type: String,
        required: true
    },
    certificate: {
        url:{
            type: String
        },
        public_id: {
            type: String
        }
    },
    sessions: [{
        type: schema.Types.ObjectId,
        ref: 'Session'
    }]
}));

export default Volunteer;