import Volunteer from '../models/volunteer';
import User from '../models/user';

import {uploadImage} from '../utils/cloudinary'

const uploadPhoto = async(req, res) => {
    try{
        //return if no image selected
        if (!req.file){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: 'No image file selected'
            });
        };

        //get authId from req
        const {id, role} = req.user;

        //get the profile
        const profileType = role === 'Volunteer' ? Volunteer : role === 'User' ? User : null;
        
        let profile = await profileType.findOne({authId: id});
        if(!profile){
            return res
            .status(400)
            .json({
                status: 'fail',
                message: "profile not found!"
            })
        }
        //upload image to cloudinary
        const image = await uploadImage(req.file, id);
        const {public_id, secure_url} = image;

        profile.avatar= {
            image: secure_url,
            cloudinary_id: public_id
        };

        await profile.save();

        res
        .status(200)
        .json({
            status: 'success',
            message: "Profile image uploaded successfully"
        });

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
    uploadPhoto
}