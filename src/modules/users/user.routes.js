import { Router } from "express";
import { ChangeMyPassword, GetMyAccountInfo, PasswordUpdating, confirmEmail, deleteAccount, getAnotherUser, getUsersByRecoveryEmail, resetPasswordRequest, signIn, signUp, updateAccount } from "./user.controller.js";
import { auth } from "../../../middleware/auth.js";
import { validation } from "../../../middleware/validation.js";
import { PasswordUpdatingValidation, confirmEmailValidation, deleteAccountValidation, getAnotherUserInfoValidate, getUsersByRecoveryEmailVaidation, getmyAccountValidation, resetPasswordRequestValidation, signInValidation, signUpValidation, updateAccountValidation, updatePasswordValidation } from "./user.validation.js";




const router = Router() ;
//& -----------------------------------------------------------------------
//&      SignUp for the User 

router.post('/signUp' , validation(signUpValidation),signUp);

//& -----------------------------------------------------------------------
//&      SignIn for the User

router.post('/signIn',validation(signInValidation),signIn) ;


//& -----------------------------------------------------------------------
//&      Delete User Account

router.delete('/deleteAccount', validation(deleteAccountValidation),auth(),deleteAccount) ;


//& -----------------------------------------------------------------------
//&     GET My Account {only by the owner}

router.get('/GetMyAccountInfo',validation(getmyAccountValidation),auth(),GetMyAccountInfo) ;

//& -----------------------------------------------------------------------
//&     GET another User Account Info 

router.get('/getAnotherUser/:id',validation(getAnotherUserInfoValidate), getAnotherUser);


//& -----------------------------------------------------------------------
//&     Changing my password  

router.patch('/ChangeMyPassword',validation(updatePasswordValidation),auth(),ChangeMyPassword) ;

//&------------------------------------------------------------------------
//&     Update my data

router.patch('/updateAccount',validation(updateAccountValidation),auth(),updateAccount);

//&------------------------------------------------------------------------
//&      GET All Accounts that has Recovery Email

router.get('/getUsersByRecoveryEmail',validation(getUsersByRecoveryEmailVaidation),auth(),getUsersByRecoveryEmail)

//&------------------------------------------------------------------------
//&        Reset Password Request

router.post('/resetPasswordRequest',validation(resetPasswordRequestValidation),auth(),resetPasswordRequest)
//&------------------------------------------------------------------------
//&            Confirm Email

router.get('/confirmEmail/:token',confirmEmail) ;
//&------------------------------------------------------------------------
//&            Password Updating

router.patch('/PasswordUpdating',validation(PasswordUpdatingValidation),auth(),PasswordUpdating) ;

export default router ;







