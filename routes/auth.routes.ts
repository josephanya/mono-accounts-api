import { Router} from "express";
import AuthControllers from "../controllers/auth.controllers";
import Validator from "../middleware/validation";

const authRoutes = Router();

authRoutes.post(
    '/login', 
    Validator.login(), 
    Validator.validationHandler, 
    AuthControllers.login
);

authRoutes.post(
    '/sign-up',
    Validator.signUp(),
    Validator.validationHandler,
    AuthControllers.signUp
);

export default authRoutes;