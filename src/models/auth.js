import mongoose from 'mongoose';
const schema = mongoose.Schema;

import bcrypt from 'bcryptjs';

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
        default: "User",
        enum: ["User", "Volunteer", "Admin"]
    },
    
}, {timestamps: true});

//hash password before saving to db
authSchema.pre('save', async function(next){
    try{
        //check if register method is local
        if(this.method !== 'local'){
            next();
        }
        //Generate salt
        const salt = await bcrypt.genSalt(10);
        //Generate a hashed password
        const hashedPassword = await bcrypt.hash(this.local.password, salt);
        //Re-assign hashed password over plain text password
        this.local.password = hashedPassword;
        next()
    }catch(error){
        next(error)
    }
});

const Auth = mongoose.model('Auth', authSchema);

export default Auth;

