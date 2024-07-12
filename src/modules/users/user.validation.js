import joi from 'joi' ;
import mongoose from 'mongoose';
import { generalFields } from '../../../utilities/generalFields.js';



const objectIdValidation = (value,helper)=>{
    return mongoose.Types.ObjectId.isValid(value) ? true : helper.message('invalid id') ;
}

export const signUpValidation = {
    body : joi.object({
        firstName: joi.string().required(),
        secondName: joi.string().required(),
        email: joi.string().email().required(),
        recoveryEmail: joi.string().email().invalid(joi.ref('email')),
        password: joi.string().min(6).required(),
        DOB: joi.date().iso(),
        mobileNumber: joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
        role: joi.string().valid('User', 'Company_HR'),
    }) 
}


export const signInValidation = {
    body : joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

export const deleteAccountValidation = {
    headers: generalFields.headers.required()
};

export const getmyAccountValidation = {
    headers: generalFields.headers.required()
};
export const getAnotherUserInfoValidate = {
    params : joi.object({
       id : joi.string().custom(objectIdValidation).required() 
    }).required()
}


export const updatePasswordValidation = {

    headers : generalFields.headers.required(),
    body :  joi.object({
        oldPassword : joi.string().min(6).required(),
        newPassword : joi.string().min(6).required()
    })
}
export const updateAccountValidation = {
    headers : generalFields.headers.required(),
    body : joi.object({
        firstName: joi.string(),
        secondName: joi.string(),
        email: joi.string().email(),
        password: joi.string().min(6),
        DOB: joi.date().iso(),
        mobileNumber: joi.string().pattern(new RegExp('^[0-9]{11}$')),
        role: joi.string().valid('User', 'Company_HR'),
    })
}


export const getUsersByRecoveryEmailVaidation = {
    headers : generalFields.headers.required(),
}
export const resetPasswordRequestValidation = {
    body : joi.object({
        email: joi.string().email(),
    })
}
export const confirmEmailValidation = {
    headers : generalFields.headers.required(),
    body : joi.object({
        email: joi.string().email(),
    })
}

export const PasswordUpdatingValidation = {
    body : joi.object({
        email: joi.string().email(),
        newPassword: joi.string().min(6),
    }),
    headers : generalFields.headers.required(),

}