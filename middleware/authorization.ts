import { Request, Response, NextFunction } from "express"
import statusCode from "../helpers/status_codes"
import { BaseError } from "../helpers/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import pino from "pino";

const secretKey: string = process.env.AUTH_SECRET || ''

const logger = pino();

class Authorization {
    checkToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const header = req.get('Authorization');
            if (!header) {
                throw new BaseError('no token', statusCode.badRequest);
            }
            const token = header.split(' ')[1];
            const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
            if (!decodedToken) {
                logger.error('invalid token provided')
                throw new BaseError('invalid token', statusCode.unAuthorized);
            }
            req.body.user_id = decodedToken.user_id;
            req.body.role = decodedToken.role;
            next();
        } catch (e) {
            logger.error(e);
            next(e);
        }
    }
}

export default new Authorization()