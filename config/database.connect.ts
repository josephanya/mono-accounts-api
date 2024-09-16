import mongoose, { ConnectOptions }  from "mongoose";
import pino from 'pino';

const dbURI: string = process.env.DB_URL || '';

const logger = pino();

export default (async () => {
    try {
       await mongoose.connect(dbURI);
       logger.info('connected to database')
    } catch (error) {
        logger.error(error)
    }
})()