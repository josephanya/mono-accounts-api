import { Router, Request, Response, NextFunction } from "express";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes";
import transactionRoutes from "./transaction.routes";

const indexRoutes = Router();

indexRoutes.use('/auth', authRoutes);
indexRoutes.use('/account', accountRoutes);
indexRoutes.use('/transaction', transactionRoutes);

indexRoutes.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: 'server is working'
    });
});

indexRoutes.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: 'resource or endpoint not found'
    })
});

export default indexRoutes;