import Joi from 'joi';

const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);
        if(result.error){
            const errorMessage = result.error.details[0].message;
            return res
            .status(400)
            .json({
                status: 'fail',
                error: errorMessage
            });
        }
        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;
        next();
    }
};

const schemas = {
    userSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone: Joi.string(),
        role: Joi.string()
    }),

    volunteerSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        designation: Joi.string().required(),
        gender: Joi.string().valid('Male', 'Female', 'Others').required(),
        experience_year: Joi.number().integer().required(),
        professional_career: Joi.string().required(),
        education_level: Joi.string().required(),
        phone: Joi.string().required()
    }),

    loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    updateProfileSchema: Joi.object().keys({
        first_name: Joi.string(),
        last_name: Joi.string(),
        phone: Joi.string(),
    }),

    bookSessionSchema: Joi.object().keys({
        user_age: Joi.number().integer(), 
        user_location: Joi.string().required(), 
        designation: Joi.string().required(), 
        session_date: Joi.string().required(), 
        session_time: Joi.string().required()
    }),

    assignVolunteer: Joi.object().keys({
        volunteer_id: Joi.string().required()
    }),

    volunteerResponseSchema: Joi.object().keys({
        status: Joi.string().valid('Accept', 'Decline', 'Reschedule').required(),
        message: Joi.string()
    })
}

export {
    validateBody,
    schemas
}