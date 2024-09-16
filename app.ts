import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import './config/database.connect';
import errorHandler from './middleware/errorHandler';
import limiter from './middleware/rateLimiter';
import indexRoutes from './routes/index.routes';
import helmet from 'helmet';
import cors from 'cors';
import { health } from './helpers/health';

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use(limiter);

app.get('/health', health);

app.use('/v1', indexRoutes);
app.use(errorHandler);

export default app;