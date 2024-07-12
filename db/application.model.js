import { Schema, model } from "mongoose";



const modelSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'job', 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        required: true
    },
    userResume: {
        type: String, 
        required: true
    }
})

const appModel = model('app',modelSchema) ;

export default appModel ;