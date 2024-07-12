import joi from 'joi';
import { generalFields } from '../../../utilities/generalFields.js';

export const createJobValidation = {
    body: joi.object({
        jobTitle: joi.string().required(),
        jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').required(),
        workingTime: joi.string().valid('part-time', 'full-time').required(),
        seniorityLevel: joi.string().valid('junior','mid-level','senior','team-leader' ,'CTO').required(),
        jobDescription: joi.string().required(),
        technicalSkills: joi.array().items(joi.string()).required(),
        softSkills: joi.array().items(joi.string()).required(),
    }),
    headers : generalFields.headers.required(),
};


export const updateJobValidation = {
    params: joi.object({
        id: joi.string().required(),
    }),
    body: joi.object({
        jobTitle: joi.string(),
        jobLocation: joi.string(),
        workingTime: joi.string().valid('part-time', 'full-time'),
        seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
        jobDescription: joi.string(),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string()),
    }),
    headers : generalFields.headers.required(),
};


export const deleteJobValidation = {
    params: joi.object({
        id: joi.string().required(),
    }),
    headers : generalFields.headers.required(),
};

export const getJobsWithCompanyInfoValid = {
    params: joi.object({
        id: joi.string().required(),
    }),
    headers : generalFields.headers.required(),
}

export const getJobsForCompanyValidation ={
    headers : generalFields.headers.required(),
}

export const getFilteredJobsValidation = {
    headers : generalFields.headers.required(),
}
