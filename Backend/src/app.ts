import express, { Application, request, response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app: Application = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mydb').then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error:', error.message);
});

app.get('/api/codeblocks', (request, response) => {
    return response.json({ codeblocks: {'code': 'console.log("Hello, World!")', 'answer': 'Hello, World!'} });
});

const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
