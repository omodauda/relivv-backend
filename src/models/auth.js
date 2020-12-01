import mongoose from 'mongoose';
const schema = mongoose.Schema;

const authSchema = new schema({

    method: {
        type: String,
        required: true,
        enum: ["local", "google"]
    },
    local:{
        username: {
            type: String,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            minlength: 5
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            lowercase: true
        }
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "volunteer", "admin"]
    },
    
}, {timestamps: true});

const Auth = mongoose.model('Auth', authSchema);

export default Auth;

