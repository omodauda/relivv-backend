import mongoose from 'mongoose';
const schema = mongoose.Schema;

const sessionSchema = new schema({

    user: {
        type: schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    volunteer: {
        type: schema.Types.ObjectId,
        ref: 'Volunteer'
    },
    volunteer_response: {
        status:{
            type: String,
            enum: ["Accept", "Decline", "Reschedule"]
        },
        message:{
            type: String
        }
    },
    user_age: {
        type: Number
    },
    user_location:{
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    session_date: {
        type: Date
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Session = mongoose.model('Session', sessionSchema);

export default Session;