import _cloudinary from 'cloudinary';
const cloudinary = _cloudinary.v2;

import config from '../config';

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name[config.environment],
    api_key: config.cloudinary_api_key[config.environment],
    api_secret: config.cloudinary_api_secret[config.environment]
});

const uploadFile = async(file) => {
    const uploadedFile = await cloudinary.uploader.upload(file.path,
        {
            resource_type: 'auto',
            folder: 'relivv/volunteers/certification'
        }
    );
    const {public_id, secure_url} = uploadedFile;
    return {public_id, secure_url};
};

const uploadImage = async(image, id) => {
    const uploadedImage = await cloudinary.uploader.upload(image.path,
        {
            folder: 'relivv/users/profile_images',
            public_id: `userid=${id}`
        }
    );
    const {public_id, secure_url} = uploadedImage;
    return {public_id, secure_url};
};

export {
    cloudinary,
    uploadFile,
    uploadImage
}

