import joi from 'joi'
import { generalFields } from '../../../utilities/generalFields.js';
import mongoose from 'mongoose';
const objectIdValidation = (value,helper)=>{
    return mongoose.Types.ObjectId.isValid(value) ? true : helper.message('invalid id') ;
}
const employeeEnum = [
    '1-10',
    '11-20',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5001-10000',
    '10001+'
];


export const createCompanyValidation = {
   
        body: joi.object({
            companyName: joi.string().required(),
            description: joi.string().required(),
            industry: joi.string().required(),
            address: joi.string().required(),
            numberOfEmployees: joi.string().valid(...employeeEnum).required(),
            companyEmail: joi.string().email().required(),
          
        }),
        headers : generalFields.headers.required()
}

export const updateCompanyValidation = {
   
    body: joi.object({
        companyName: joi.string(),
        description: joi.string(),
        industry: joi.string(),
        address: joi.string(),
        numberOfEmployees: joi.string().valid(...employeeEnum),
        companyEmail: joi.string().email(),
      
    }),
    params : joi.object({
            id : joi.string().custom(objectIdValidation).required() 
     }).required(),
    headers : generalFields.headers.required()
}


export const deletingCompanyValidation = {
    params : joi.object({
        id : joi.string().custom(objectIdValidation).required() 
     }).required(),
    headers : generalFields.headers.required()
}

export const searchingByCompanyNameValidation = {
    headers : generalFields.headers.required(),
    body: joi.object({
        companyName: joi.string(), 
    })

}

export const getCompanyDataValidation = {
    headers : generalFields.headers.required(),
    params : joi.object({
        id : joi.string().custom(objectIdValidation).required() 
     }).required(),
}