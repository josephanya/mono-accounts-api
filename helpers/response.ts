import { Response } from "express";

class CustomResponse {
    success(res: Response, status: number, message: string, data?: any ) {
        return res.status(status).json({
            status: 'success',
            message,
            data,
        });
    }

    failure(res: Response, status: number, message: string, data?: any ) {
        return res.status(status).json({
            status: 'failed',
            message,
            data,
        });
    }
}
export default new CustomResponse();