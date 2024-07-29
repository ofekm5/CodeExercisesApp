import express, { Application } from 'express';
import bodyParser from 'body-parser';
import router from './controllers/router';
import logger from './logger';
import { createServer } from 'http';
import initSocket from './controllers/socket';
import initMongoDB from './models/initMongoDB';

const app: Application = express();
const server = createServer(app);
const PORT: number = parseInt(process.env.PORT || '5000', 10);
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

app.use(bodyParser.json());
app.use('/api', router);

async function startServer() {
  try {
    await initMongoDB(mongoURI);
    initSocket(server);
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error);
  }
}

startServer();
