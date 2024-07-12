import userModel from "../../../db/user.model.js";
import bcrypt from 'bcrypt' ;
import { ObjectId } from "bson";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { AppError } from "../../../index.js";
import { asyncHandler } from "../../../utilities/globalErrorHandler.js";
import { sendEmail } from "../../services/sendEmail.js";




//& -----------------------------------------------------------------------------------------------------------
//&                                       SignUp for the User 
export const signUp = asyncHandler(async (req, res, next) => {
        const { firstName, secondName, email, password, DOB, mobileNumber, role ,recoveryEmail} = req.body;
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return next(new AppError('User is already exists'))  ;
        }
        const hashPassword = bcrypt.hashSync(password , 9) ;
        const newUser = await userModel.create({
            firstName,
            secondName, 
            email,
            password : hashPassword,
            DOB,
            mobileNumber,
            recoveryEmail,
            role,
            userName: `${firstName} ${secondName}`,
        });

        return res.status(201).json({ msg: "User created successfully", user: newUser });
     
}) 
//& -----------------------------------------------------------------------------------------------------------

//&                                         SignIN for the User 
export const signIn = asyncHandler(async (req, res, next) => {
        const { email, password, mobileNumber, recoveryEmail } = req.body;
        const existUser = await userModel.findOne({
            $or: [
                { email },
                { recoveryEmail: email },
                { mobileNumber }
            ]
        });
        if (!existUser) {
            return next(new AppError('Incorrect Email or mobile number'));
        }
        const checkPassword = bcrypt.compareSync(password, existUser.password);
        if (!checkPassword) {
            return next(new AppError('Incorrect password'));
        }
        await userModel.updateOne(
            { _id: existUser._id },
            { $set: { status: "online" } }
        );
        const updatedUser = await userModel.findById(existUser._id);
        const token = jwt.sign({ email: updatedUser.email , userId: existUser._id}, 'LoginToken');
        return res.status(200).json({ msg: "done", token, user: updatedUser });
}
) 

//& -----------------------------------------------------------------------------------------------------------

//&                             Delete Account {Only the owner of the account can delete it .....}


export const deleteAccount = asyncHandler(async (req, res, next) => {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            next(new AppError("You should login")) ;
        }

        const deleteUser = await userModel.deleteOne({ _id: user._id });
        return res.json({ msg: "Account deleted successfully", deleteUser });
    
}) 


//& -----------------------------------------------------------------------------------------------------------

//&                          GET user account info {only the owner can get these info} 


export const GetMyAccountInfo = asyncHandler(async (req,res,nest) =>{
        console.log('my info',req.user._id);
        const user = await userModel.findById(req.user._id);
        if (!user) {
           next(new AppError('You should login'));
        }
        const getUser = await userModel.findOne({ _id: user._id });
        return res.json({ msg: "done", getUser });
    
}) 

//& ------------------------------------------------------------------------------------------------------------------------------

//&                        GET another user account info {only name : [first , second , full] ,  Phone number and userStatus } 


export const getAnotherUser = asyncHandler(async (req, res, next) => {
        const { id } = req.params; 
        const user = await userModel.find({ _id: new ObjectId(id) }).select('firstName secondName email'); 
        if (!user) {
            next(new AppError("User not found"))
        } else {
            return res.json({ msg: "done", user });
        }
    
}) 

//& ------------------------------------------------------------------------------------------------------------------------------

//&                                      Update My password 


export const ChangeMyPassword = asyncHandler(async (req,res,next)=>{
    const {newPassword ,oldPassword} = req.body ;
    if(!newPassword){
        next(new AppError("You haven't enter your updated password ..."))
    }else if(!oldPassword){
        next(new AppError('you should enter your current password....')) ;

    }else{
          const isSamePassword = bcrypt.compareSync(newPassword , req.user.password) ;
          const currentPassword = bcrypt.compareSync(oldPassword,req.user.password) ;
          if(!currentPassword){
             
             next(new AppError('you entered wrong password please enter the correct one')) ;

          }else{
            if(isSamePassword){
                next(new AppError("Updated password must be different ....")) ;
              }else{
                const newHashedPassword = bcrypt.hashSync(newPassword,9) ;
               let updatedpass = await userModel.findByIdAndUpdate(req.user._id, { password: newHashedPassword });
               return res.json({ msg: "Password updated successfully" , updatedpass });
              }
          }
          
    }
}) 
//& ----------------------------------------------------------------------------------------------------------------
//&                                         Update my data  


export const updateAccount = asyncHandler(async (req, res, next) => {
        const { email, mobileNumber, recoveryEmail, DOB, firstName, lastName } = req.body;
        const userId = req.user._id;

        const conflictUser = await userModel.findOne({
            $or: [
                { email },
                { mobileNumber }
            ],
            _id: { $ne: userId }
        });

        if (conflictUser) {
            next(new AppError("Email or mobile number already in use"));
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            email,
            mobileNumber,
            recoveryEmail,
            DOB,
            firstName,
            lastName,
            userName: `${firstName || req.user.firstName} ${lastName || req.user.secondName}` 
        }, { new: true }); 

        if (!updatedUser) {
           next(new AppError("User not found"));
        }

        return res.json({ msg: "Account updated successfully", user: updatedUser }); 
}
) 


//& ------------------------------------------------------------------------------------------------------------------------------

//&                                     GET All Accounts that has Recovery Email


export const getUsersByRecoveryEmail = asyncHandler(async (req, res, next) => {
    const users = await userModel.find({ recoveryEmail: { $exists: true } });
    if (!users.length) {
        return next(new AppError('No accounts found with a recovery email'));
    }

    res.status(200).json({msg: 'done', users: users});
});

//& ------------------------------------------------------------------------------------------------------------------------------

//&                                     Reset password Request .......

export const resetPasswordRequest = asyncHandler(async (req, res, next) => {
    const {email} = req.body;
    if (!email) {
        return next(new AppError('Email is required'));
    }
    const user = await userModel.findOne({ email });
    console.log('Found user:', user);
    if (!user) {
        return next(new AppError('The entered Email is not found ...'));
    }
    const token = jwt.sign({ email }, 'resettingToken');
    const link = `http://localhost:4000/confirmEmail/${token}`;
    const checkEmail = await sendEmail(email, "Reset Password", `<h3>${link}</h3>`);
    if (!checkEmail) {
        return next(new AppError('Message is not sent'));
    } else {
        res.json({ msg: "done", token });
    }
});


export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
        const decoded = jwt.verify(token, 'resettingToken');
        if (!decoded?.email) {
            return next(new AppError('Invalid payload..'));
        }

        const user = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { $set: { restPass: true } },
            { new: true }
        );

        if (!user) {
            return next(new AppError('User not found'));
        }

        res.json({ msg: "done" ,user});
    
});

export const PasswordUpdating = asyncHandler(async (req, res, next) => {
    const { newPassword, email } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await userModel.findOneAndUpdate(
            {email :email},
            {password: hashedPassword, restPass: false},
            {new: true}
        );

       

        if (!user) {
            return next(new AppError('User not found'));
        }

        res.json({ msg: "done" ,user });
    
});

