import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import codeBlock from '../models/codeBlock';
import logger from '../logger';

const router = express.Router();
let totalBlocks = 4;

router.get('/codeblocks', [
  check('page').optional().isInt({ min: 1 }).toInt(),
  check('limit').optional().isInt({ min: 1 }).toInt()
], async (request: Request, response: Response) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error('Validation error:', errors.array());
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const { page = 1, limit = 10 } = request.query;
    const result = await codeBlock.find()
      .select('name')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    logger.info('codeblocks fetched successfully');

    return response.json({ codeblocks: result });
  } 
  catch (error) {
    logger.error('Error fetching codeblocks:', error);
    response.status(500).send('Internal Server Error');
  }
});

router.post('/codeblocks', [
  check('name').notEmpty().withMessage('Name is required').trim().escape(),
  check('code').notEmpty().withMessage('Code is required').trim(),
  check('answer').notEmpty().withMessage('Answer is required').trim()
], async (request: Request, response: Response) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error('Validation error:', errors.array());
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, code, answer } = request.body;
    const id = (totalBlocks + 1).toString();
    const newCodeBlock = await codeBlock.create({ id, name, code, answer });
    totalBlocks++;
    logger.info('Block created successfully  ', newCodeBlock);
    return response.status(201).json({ codeblock: newCodeBlock });
  } 
  catch (error) {
    logger.error('Error creating block:', error);
    response.status(500).send('Internal Server Error');
  }
});

router.delete('/codeblocks/:id', [
  check('id').notEmpty().withMessage('ID is required').trim().escape()
], async (request: Request, response: Response) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error('Validation error:', errors.array());
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = request.params;
    const result = await codeBlock.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      logger.error('CodeBlock not found');
      return response.status(404).json({ error: 'CodeBlock not found' });
    }

    totalBlocks--;
    logger.info(`Block ${id} deleted successfully`);
    return response.status(204).send();
  } 
  catch (error) {
    logger.error('Error deleting data:', error);
    response.status(500).send('Internal Server Error');
  }
});

export default router;
