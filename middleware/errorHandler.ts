import { Request, Response, NextFunction } from "express"
import { BaseError } from "../helpers/error"
import CustomResponse from "../helpers/response"
import statusCode from "../helpers/status_codes"

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof BaseError) {
        return CustomResponse.failure(res, err.status, err.message);
    } else {
        return CustomResponse.failure(res, statusCode.serverError, err.message);
    }
}

export default errorHandler;