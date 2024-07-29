import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import codeBlock from './models/codeBlock';
import logger from './logger';

const router = express.Router();

router.get('/api/codeblocks', [
  check('page').optional().isInt({ min: 1 }).toInt(),
  check('limit').optional().isInt({ min: 1 }).toInt()
], async (request: Request, response: Response) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  const { page = 1, limit = 10 } = request.query;

  try {
    const result = await codeBlock.find()
      .select('name')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    return response.json({ codeblocks: result });
  } 
  catch (error) {
    logger.error('Error fetching data:', error);
    response.status(500).send('Internal Server Error');
  }
});

router.post('/api/codeblocks', [
  check('name').notEmpty().withMessage('Name is required').trim().escape(),
], async (request: Request, response: Response) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const newCodeBlock = await codeBlock.create(request.body);
    return response.status(201).json({ codeblock: newCodeBlock });
  } catch (error) {
    logger.error('Error creating data:', error);
    response.status(500).send('Internal Server Error');
  }
});

router.delete('/api/codeblocks/:id', [
  check('id').isMongoId().withMessage('Invalid ID format')
], async (request: Request, response: Response) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    await codeBlock.findByIdAndDelete(request.params.id);
    return response.status(204).send();
  } catch (error) {
    logger.error('Error deleting data:', error);
    response.status(500).send('Internal Server Error');
  }
});

export default router;
