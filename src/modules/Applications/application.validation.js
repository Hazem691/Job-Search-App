import joi from 'joi'

export const applyToJobSchema = {

    params: joi.object({
        id: joi.string().required().length(24).hex(), 
    }),
    file: joi.object({
        mimetype: joi.string().valid('application/pdf').required(),
        destination: joi.string().required(),
        path : joi.string().required(),
        filename:joi.string().required(),
        size : joi.string().required(),
        
        
    })
};
