import { Router } from "express";
import { validation } from "../../../middleware/validation.js";
import { createJobValidation, deleteJobValidation, getFilteredJobsValidation, getJobsForCompanyValidation, getJobsWithCompanyInfoValid, updateJobValidation } from "./jobs.validation.js";
import { auth, authorization } from "../../../middleware/auth.js";
import { addJob, deleteJob, getFilteredJobs, getJobsForCompany, getJobsWithCompanyInfo, updateJob } from "./jobs.controller.js";



const router = Router() ;
//&---------------------------------------------------------------------------------------------------------------------------------
//&                                    Add Job

router.post('/addJob',validation(createJobValidation),auth(),authorization(["Company_HR"]) , addJob   )

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                    Update Job

router.patch('/updateJob/:id',validation(updateJobValidation),auth(),authorization(["Company_HR"]),updateJob) ;

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         Delete Specific Job

router.delete('/deleteJob/:id',validation(deleteJobValidation),auth(),authorization(["Company_HR"]),deleteJob) ;

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         GET all jobs with their hr and company

router.get('/getJobsWithCompanyInfo',validation(getJobsForCompanyValidation),auth(),authorization(["Company_HR","User"]),getJobsWithCompanyInfo)

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         GET all jobs for Specific comany name

router.get('/getJobsForCompany',validation(getJobsForCompanyValidation),auth(),authorization(["Company_HR","User"]),getJobsForCompany);

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         GET Filtered Jobs

router.get('/getFilteredJobs',validation(getFilteredJobsValidation),auth(),authorization(["Company_HR","User"]) ,getFilteredJobs)

export default router ;