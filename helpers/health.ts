import { Request, Response } from "express";

export const health = async (req: Request, res: Response) => {
    const data = {
        uptime: process.uptime(),
        responsetime: process.hrtime(),
        message: 'Service is Up',
        date: new Date()
    }
    res.status(200).send(data);
}