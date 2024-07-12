import express from 'express' ;
import connectionDB from './db/connection.js';
import userRouter from './src/modules/users/user.routes.js';
import companyRouter from './src/modules/Company/company.routes.js';
import jobsRouter from './src/modules/Jobs/jobs.routes.js';
import appRouter from './src/modules/Applications/application.routes.js';

const app = express()
const port = 4000

app.use(express.json()) ;


connectionDB() ;


app.use(userRouter) ;

app.use(companyRouter) ;
app.use(jobsRouter)    ;
app.use(appRouter)     ;
export class AppError extends Error {
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        
       
    }
}

// Middleware to handle invalid URLs
app.use('*', (req, res, next) => {
    const err = new AppError("Invalid URL",404);
    next(err);
});

app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({msg : "There is an error",err:err.message}) ;
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))