import { isBuffer } from "util";
import appModel from "../../../db/application.model.js";
import jobModel from "../../../db/jobs.model.js";
import cloudinary from "../../../utilities/cloudinary.js";
import { asyncHandler } from "../../../utilities/globalErrorHandler.js";
import { AppError } from "../../../index.js";


export const applyToJob = asyncHandler(async (req, res, next) => {
    const { userId, userTechSkills, userSoftSkills } = req.body;
    const { id } = req.params;
    const file = req.file;

    if (!file) {
        return next(new AppError('No file uploaded'));
    }

    const job = await jobModel.findById(id);
    if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the user has already applied to this job
    const existingApplication = await appModel.findOne({ jobId: id, userId });
    if (existingApplication) {
        return next(new AppError('You have already applied to this job'));
    }

    // Upload resume to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: 'resumes',
        resource_type: 'auto',
        format: 'pdf'
    });

    if (!uploadResponse || !uploadResponse.secure_url) {
        // If upload fails, clean up and return an error
        await cloudinary.uploader.destroy(uploadResponse?.public_id);
        return next(new AppError('File upload failed'));
    }

    // Create new application record
    const application = await appModel.create({
        jobId: id,
        userId,
        userTechSkills,
        userSoftSkills,
        userResume: uploadResponse.secure_url,
    });

    res.json({ msg: 'Application submitted successfully', application });
});
