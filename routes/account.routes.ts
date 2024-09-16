import { Router} from "express";
import AccountControllers from "../controllers/account.controllers";
import Validator from "../middleware/validation";
import Authorization from "../middleware/authorization";

const accountRoutes = Router();

accountRoutes.post(
    '/search',
    Authorization.checkToken,
    Validator.searchAccount(), 
    Validator.validationHandler, 
    AccountControllers.searchAccount
);

accountRoutes.post(
    '/create',
    Authorization.checkToken, 
    AccountControllers.createAccount
);

accountRoutes.get(
    '/',
    Authorization.checkToken, 
    AccountControllers.getAccounts
);

export default accountRoutes;