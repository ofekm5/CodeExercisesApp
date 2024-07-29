import express, { Application } from 'express';
import bodyParser from 'body-parser';
import router from './router';
import logger from './logger';
import { createServer } from 'http';
import initSocket from './socket';
import initMongoDB from './models/initMongoDB';

const app: Application = express();
const server = createServer(app);
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(bodyParser.json());
app.use('/api/users', router);

initMongoDB();
initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
