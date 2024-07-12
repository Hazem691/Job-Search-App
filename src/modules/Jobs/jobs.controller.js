
import { ObjectId } from 'bson';
import jobModel from '../../../db/jobs.model.js';
import { asyncHandler } from '../../../utilities/globalErrorHandler.js';
import { AppError } from '../../../index.js';
import companyModel from '../../../db/company.model.js';

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                    Add Job

export const addJob = asyncHandler(async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;

    const newJob = await jobModel.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: req.user._id ,
        
    });

    return res.status(201).json({ msg: 'Job added successfully', job: newJob });
});

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                    Update Job

export const updateJob = async (req,res,next)=>{
    const {id} = req.params ;
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    const job = await jobModel.find({_id : new ObjectId(id)})
    const theJobId = job[0]._id ;
    if(!job.length){
        next(new AppError('The company is not found...')) ;
    }else{
        const job = await jobModel.findByIdAndUpdate(
            { _id: theJobId}, 
            {
                $set: {
                    jobTitle,
                    jobLocation,
                    workingTime,
                    seniorityLevel,
                    jobDescription,
                    technicalSkills,
                    softSkills
                }
            },
            { new: true }
        );
        res.json({msg : "done",job})
    }
}
//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         Delete Specific Job

export const deleteJob = asyncHandler(async (req, res, next) => {
    const {id} = req.params ;
    const job = await jobModel.findById(id) ;
    
    console.log(job);
    if(!job){
        next(new AppError('job is not found'))
    }

   

     const deleting = await jobModel.findByIdAndDelete(job) ;


     res.json({ msg: 'Job deleted successfully',deleting });
})

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         GET all jobs with their hr and company

export const getJobsWithCompanyInfo = asyncHandler(async (req, res, next) => {
  
        
        const jobs = await jobModel.find().populate({
            path: 'addedBy',
            select: 'firstName secondName email'
        });

      
        const companies = await companyModel.find({});

        
        const jobsWithCompany = jobs.map(job => {
            const company = companies.find(comp => comp.companyHR && comp.companyHR.toString() === job.addedBy._id.toString());
            return {
                ...job._doc,
                companyName: company ? company.companyName : null
            };
        });

        res.json({ jobs: jobsWithCompany });
    
});


//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         GET all jobs for Specific comany name

export const getJobsForCompany = asyncHandler(async (req, res,next) => {
    const { companyName } = req.query;
    if (!companyName) {
        next(new AppError('company name is required...'))
    }

 
    const company = await companyModel.findOne({ companyName }).exec();
    if (!company) {
        next(new AppError('company name is not found...'))
    }
    const jobs = await jobModel.find({ addedBy: company.companyHR }).populate({
        path: 'addedBy',
        select: 'firstName secondName email'
    }).exec();

    res.json({msg : "done",jobs});
});

//&---------------------------------------------------------------------------------------------------------------------------------
//&                                         GET Filtered Jobs

export const getFilteredJobs = asyncHandler(async(req,res,next)=>{
        const {workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills} = req.query ;

        const queryFiltering = {} ;
        if (workingTime){
            queryFiltering.workingTime = workingTime;
        } 
        if (jobLocation){
            queryFiltering.jobLocation = jobLocation;
        } 
        if (seniorityLevel){
            queryFiltering.seniorityLevel = seniorityLevel;
        } 
        if (jobTitle){
            queryFiltering.jobTitle = jobTitle

        }  
        if (technicalSkills){
            queryFiltering.technicalSkills = { $in: technicalSkills.split(',') };

        } 
        const jobs = await jobModel.find(queryFiltering)
            .populate({
                path: 'addedBy',
                select: 'firstName secondName email companyHR', // Include companyHR field
                populate: {
                    path: 'companyHR', // Populate companyHR field
                    model: 'company', // Specify the model to populate
                    select: 'companyName' // Select companyName field
                }
            });
        res.json({msg : "done" , jobs}) ;
})