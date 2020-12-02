import Joi from 'joi';
import userSchema from './user';

const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);
        if(result.error){
            const errorMessage = result.error.details[0].message;
            return res
            .status(400)
            .json({
                status: 'fail',
                error: {
                message: errorMessage
                }
            });
        }
        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;
        next();
    }
};

const schemas = {
    userSchema: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone: Joi.string()
    }),
    volunteerSchema: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        designation: Joi.string().required(),
        gender: Joi.string().required(),
        experience_year: Joi.number().required(),
        professional_career: Joi.string().required(),
        education_level: Joi.string().required(),
        phone: Joi.string().required()
    })
}

export {
    validateBody,
    schemas
}