import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    secondName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
   
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    recoveryEmail: {
        type: String,
    },
    DOB: { 
        type: Date,
        required: true,
    },
    mobileNumber: {
        type: String, 
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["User", "Company_HR"],
        default : "User" ,
        required: true,
    },
    restPass : {
        type : Boolean ,
        default : false
        
    },
    status: {
        type: String,
        enum: ["online", "offline"],
        default : "offline"
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'company'  
    }
});

userSchema.pre('save', function (next) {
    this.userName = `${this.firstName} ${this.secondName}`; 
    next();
});

const userModel = model('user', userSchema);

export default userModel;
