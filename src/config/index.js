import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',

    databaseUrl: {
        development: 
            process.env.DEV_DATABASE_URL ||
            'mongodb://localhost/relivv',
        production: 
            process.env.PRODUCTION_DATABASE_URL ||
            '',
        test:
            process.env.TEST_DATABASE_URL ||
            'mongodb://localhost/relivv_test'
    },

    jwtSecret: process.env.JWT_SECRET,
    nodemailer_email: process.env.NODEMAILER_EMAIL,
    nodemailer_password: process.env.NODEMAILER_PASSWORD,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    cloudinary_cloud_name: {
        development: process.env.DEV_CLOUDINARY_CLOUD_NAME,
        production: process.env.PROD_CLOUDINARY_CLOUD_NAME
    },
    cloudinary_api_key: {
        development: process.env.DEV_CLOUDINARY_API_KEY,
        production: process.env.PROD_CLOUDINARY_API_KEY
    },
    cloudinary_api_secret: {
        development: process.env.DEV_CLOUDINARY_API_SECRET,
        production: process.env.PROD_CLOUDINARY_API_SECRET
    },
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production',
    test: process.env.NODE_ENV === 'test'
}

