import { body, validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

class Validator {
    login = () => {
        return [
            body('email').trim().isEmail().withMessage('please enter a valid email').normalizeEmail(),
            body('password', 'please enter a password with at least 8 characters').trim().isLength({ min: 8 })
        ]
    }

    signUp = () => {
        return [
            body('first_name', 'please enter your first name').trim().not().isEmpty(),
            body('last_name', 'please enter your last name').trim().not().isEmpty(),
            body('email').trim().isEmail().withMessage('please enter a valid email').normalizeEmail(),
            body('password', 'please enter a password with at least 8 characters').trim().isLength({ min: 8 })
        ]
    }

    searchAccount = () => {
        return [
            body('account_number', 'please enter a 10 digit account number').trim().isLength({ min: 10, max: 10 })
        ]
    }

    sendMoney = () => {
        return [
            body('sender_account_number', 'please enter a 10 digit account number').trim().isLength({ min: 10, max: 10 }),
            body('recipient_account_number', 'please enter a 10 digit account number').trim().isLength({ min: 10, max: 10 }),
            body('amount').exists().withMessage('Amount is required.').isNumeric().withMessage('Amount must be a number.')
        ]
    }

    validationHandler = (req: Request, res: Response, next: NextFunction) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                status: 'failed',
                message: 'validation failed',
                error: error.array()
            });
        }
        next();
    }
}

export default new Validator()
