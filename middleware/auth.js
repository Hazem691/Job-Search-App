import jwt from 'jsonwebtoken';
import userModel from '../db/user.model.js';

export const auth = () => {
    return async (req, res, next) => {
        try {
            const {token} = req.headers;

            if (!token) {
                return res.status(401).json({ msg: "Token does not exist" });
            }

            const decoded = jwt.verify(token, 'LoginToken');

            if (!decoded || !decoded.userId) {
                return res.status(401).json({ msg: "Invalid payload" });
            }

            console.log("Decoded token:", decoded);

            const user = await userModel.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            req.user = user;
            console.log("Authenticated user:", req.user);
            next();
        } catch (err) {
            console.error('Error authenticating user:', err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    };
};


export const authorization = (roles = [])=>{
    return async(req,res,next)=>{
        try{
            const {role} = req.user ;
          
       
            if(!roles.includes(role)){
                res.json({msg : "You don't have permisson to do that"})
            }else{
                next() ;
            }
        }catch(err){
            res.json({msg :"There is an error",err :err}) ;
        }
    }
}
