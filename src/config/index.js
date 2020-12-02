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
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production',
    test: process.env.NODE_ENV === 'test'
}

