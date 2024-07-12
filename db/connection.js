import mongoose from "mongoose"



 const connectionDB = async ()=>{
     return await mongoose.connect("mongodb://localhost:27017/jobSearchApp").then(()=>{
        console.log('connected to db')
    }).catch((err)=>{
        console.log("Not connected to db");
    }) }


export default connectionDB ;