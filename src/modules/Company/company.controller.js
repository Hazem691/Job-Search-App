import { ObjectId } from "bson";
import companyModel from "../../../db/company.model.js";
import userModel from "../../../db/user.model.js";
import { AppError } from "../../../index.js";
import { asyncHandler } from "../../../utilities/globalErrorHandler.js";
import jobModel from "../../../db/jobs.model.js";
import appModel from "../../../db/application.model.js";
import { log } from "console";



//&------------------------------------------------------------------------------------------------------------
//&                                             add Company
export const addCompany = asyncHandler(async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

    // Check if company with the same name already exists
    const existingCompany = await companyModel.findOne({ companyName });
    if (existingCompany) {
        return next(new AppError('Company with this name already exists.', 400));
    }

 
    const theHR = await userModel.findById(req.user._id);
    if (!theHR) {
        return next(new AppError('HR user not found.', 404));
    }

    
    const newCompany = await companyModel.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR: req.user._id
    });

    res.status(201).json({ msg: 'Company added successfully', company: newCompany });
});


//&------------------------------------------------------------------------------------------------------------
//&                                             update Company


export const updateComany = asyncHandler(async(req,res,next)=>{
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    const {id} = req.params ;
    const company = await companyModel.findOne({_id :id,companyHR: req.user._id });
   
    
    if(! company){
        next(new AppError('The company is not found ...')) ;
    }else{
        const updatedCompany = await companyModel.findByIdAndUpdate(
            { _id: id, companyHR: req.user._id },
            { 
                companyName,
                description,
                industry,
                address,
                numberOfEmployees,
                companyEmail
            },
            { new: true}
        );
        res.json({msg :"done",updatedCompany}) ;
    }
    
})

//&------------------------------------------------------------------------------------------------------------
//&                                             delete Company

export const deleteCompany = asyncHandler( async (req,res,next)=>{
    const {id} = req.params ;
    const company = await companyModel.find({_id: new ObjectId(id),companyHR: req.user._id });
    if(!company.length){
        next(new AppError('Company is not found....'));
    }else{
        const companyid = company[0]._id ;
         let deleting = await companyModel.findByIdAndDelete(companyid);
         res.json({msg : "done",deleting}) ;
    }
    
    
})

//&------------------------------------------------------------------------------------------------------------
//&                                             search for Compay name


export const searchByCompanyName = asyncHandler(async (req,res,next)=>{
    const {companyName} = req.body ;
    const searchedCompany = await companyModel.findOne({companyName : companyName}) ;
    if(!searchedCompany){
        next(new AppError('The company is not found ....')) ;
    }else{
        res.json({msg : "done",searchedCompany}) ;
    }
})

//&------------------------------------------------------------------------------------------------------------
//&                                             GET Company Data


export const getCompanyData = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const company = await companyModel.findById({_id: new ObjectId(id)}) ;
      
        if (!company) {
            next(new AppError('Company not found')) ;
        }
        
        const jobs = await jobModel.find({ 'addedBy': company.companyHR })
            .populate({
                path: 'addedBy',
                select: 'firstName secondName email',
            });
 

        res.json({ company, jobs });
    
});


//&------------------------------------------------------------------------------------------------------------
//&                                             GET All application for the job

export const getAllApplicationsForJob = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;
  
        const job = await jobModel.findById(id);
        if (!job) {
            return next(new AppError('Job not found'));
        }

        const applications = await appModel.find({ jobId: id }).populate('userId', 'firstName secondName email mobileNumber address');
    
        res.json({ msg: "done", applications });
   
});