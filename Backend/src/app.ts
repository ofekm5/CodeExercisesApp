import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import router from './router';
import logger from './logger';
import { createServer } from 'http';
import initSocket from './socket';

const app: Application = express();
const server = createServer(app);
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mydb').then(() => {
  logger.info('Connected to MongoDB');
}).catch((error) => {
  logger.error('Connection error:', error.message);
});

app.use('/api/users', router);

initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
