import { Router } from "express";
import { auth, authorization } from "../../../middleware/auth.js";
import { addCompany, deleteCompany, getAllApplicationsForJob, getCompanyData, searchByCompanyName, updateComany } from "./company.controller.js";
import { validation } from "../../../middleware/validation.js";
import { createCompanyValidation, getCompanyDataValidation, searchingByCompanyNameValidation, updateCompanyValidation } from "./company.validation.js";
import { deleteAccountValidation } from "../users/user.validation.js";




const router = Router() ;

//&-----------------------------------------------------------------------------------------------------------------------------------
//&                                  Add Company
router.post('/addCompany',validation(createCompanyValidation),auth(),authorization(["Company_HR"]),addCompany)

//&-----------------------------------------------------------------------------------------------------------------------------------
//&                                  Update Company
router.patch('/updateCompany/:id',validation(updateCompanyValidation), auth(), authorization(["Company_HR"]), updateComany);


//&-----------------------------------------------------------------------------------------------------------------------------------
//&                                  Delete Company

router.delete('/deleteCompany/:id',validation(deleteAccountValidation),auth(),authorization(["Company_HR"]),deleteCompany)


//&-----------------------------------------------------------------------------------------------------------------------------------
//&                                  Search Company By name

router.get('/searchByCompanyName',validation(searchingByCompanyNameValidation),auth(),authorization(["Company_HR","User"]),searchByCompanyName) ;

//&-----------------------------------------------------------------------------------------------------------------------------------
//&                                  Get Company and it's jobs

router.get('/getCompanyData/:id',validation(getCompanyDataValidation),auth(),authorization(["Company_HR"]),getCompanyData) ;

//&-----------------------------------------------------------------------------------------------------------------------------------
//&                                  Get All job Applications

router.get('/getAllApplicationsForJob/:id',auth(),authorization(["Company_HR"]),getAllApplicationsForJob) ;
export default router ;