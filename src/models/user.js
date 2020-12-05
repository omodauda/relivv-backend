import mongoose from 'mongoose';
const schema = mongoose.Schema;
import Profile from './profile';

const User = Profile.discriminator('User', new schema({

    authId: {
        type: schema.Types.ObjectId,
        ref: "Auth"
    },
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
        type: String
    },
    sessions: [{
        type: schema.Types.ObjectId,
        ref: 'Session'
    }]

},));

export default User;