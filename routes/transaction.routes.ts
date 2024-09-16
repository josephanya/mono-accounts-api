import { Router} from "express";
import TransactionControllers from "../controllers/transaction.controllers";
import Validator from "../middleware/validation";
import Authorization from "../middleware/authorization";

const transactionRoutes = Router();

transactionRoutes.post(
    '/send',
    Authorization.checkToken,
    Validator.sendMoney(), 
    Validator.validationHandler, 
    TransactionControllers.sendMoney
);

transactionRoutes.get(
    '/:account_number',
    Authorization.checkToken, 
    TransactionControllers.getTransactions
); 

export default transactionRoutes;