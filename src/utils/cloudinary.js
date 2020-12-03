import _cloudinary from 'cloudinary';
const cloudinary = _cloudinary.v2;

import config from '../config';

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name[config.environment],
    api_key: config.cloudinary_api_key[config.environment],
    api_secret: config.cloudinary_api_secret[config.environment]
});

export {
    cloudinary
}

