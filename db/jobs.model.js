import { Schema, model } from "mongoose";

const jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobLocation: {
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
        required: true,
    },
    workingTime: {
        type: String,
        enum: ['part-time', 'full-time'],
    },
    seniorityLevel: {
        type: String,
        enum: ['junior', 'mid-level', 'senior', 'team-leader', 'CTO'],
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    technicalSkills: {
        type: [String],
        required: true,
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        

    },
    
  
});

const jobModel = model('job', jobSchema);

export default jobModel;
