
import { Schema, model } from "mongoose";

const companySchema = new Schema({
    companyName : {
        type : String ,
        required : true ,
        unique: true,
    },
    description : {
        type : String ,
        required : true,
    },
    industry : {
        type : String ,
        required : true ,
    },
    address :{
        type : String ,
        required : true,
    },
    numberOfEmployees :{
        type : String ,
        enum: ['1-10',
             '11-20', 
            '11-50', 
            '51-200', 
            '201-500', 
            '501-1000', 
            '1001-5000', 
            '5001-10000', 
            '10001+'
        ],
        required : true,
    },
    companyEmail :{
        type : String,
        required : true,
        unique : true
    },
    companyHR : {
        type : Schema.Types.ObjectId ,
        ref : "user",
     
    }
    
})


const companyModel = model('company',companySchema) ;
export default companyModel ;