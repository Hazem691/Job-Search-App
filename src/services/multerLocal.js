import multer from "multer";
import { AppError } from "../../index.js";

export const validExtension = {
    pdf : ["application/pdf"]
}


export const multerHost = (customValidation = ['application/pdf'])=>{
    const storage = multer.diskStorage({}) ;

   const fileFilter = function(req,file,cb){

        if(customValidation.includes(file.mimetype)){
            return cb(null ,true);
        }else{
            return cb(new AppError('file not supported'),false) ;

        }

    }

    const upload = multer({fileFilter ,storage}) ;
    return upload ;
}