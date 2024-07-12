import { Router } from "express";
import { multerHost, validExtension } from "../../services/multerLocal.js";
import { applyToJob } from "./application.controller.js";
import { auth, authorization } from "../../../middleware/auth.js";
import { validation } from "../../../middleware/validation.js";
import { applyToJobSchema } from "./application.validation.js";




const router = Router();

router.post('/applyToJob/:id',validation(applyToJobSchema) ,auth(),authorization(["User"]),multerHost(validExtension.pdf).single('userResume'), applyToJob);

export default router ;