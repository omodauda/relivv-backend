import mongoose from 'mongoose';
const schema = mongoose.Schema;

import bcrypt from 'bcryptjs';

const authSchema = new schema({

    methods: {
        type: [String],
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
    is_verified: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true});

//hash password before saving to db
authSchema.pre('save', async function(next){
    try{
        //check if register method is local
        if(!this.methods.includes('local')){
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

//checks if password is valid on login
authSchema.methods.isValidPassword = async function (password){
    try{
        return await bcrypt.compare(password, this.local.password);
    }
    catch(error){
        throw new Error(error);
    }
};

const Auth = mongoose.model('Auth', authSchema);

export default Auth;

