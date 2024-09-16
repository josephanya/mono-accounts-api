import app from './app'
import pino from 'pino';

const port = process.env.PORT || 3000;

const logger = pino();

app.listen(port, async () => {
    logger.info(`application started on port: ${port}`)
});