import mongoose from 'mongoose';
import logger from '../logger';
import CodeBlock from './codeBlock';

export default async function initMongoDB(mongoURI: string = 'mongodb://localhost:27017/mydb') {
  await connectToMongoDB(mongoURI);
  await addInitValues();
}

async function connectToMongoDB(mongoURI: string) {
  try {
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB');
  } 
  catch (error: any) {
    logger.error('Connection error:', error.message);
    throw error;
  }
}

async function addInitValues() {
  try {
    logger.info('Adding initial values to MongoDB');

    await CodeBlock.create({
      name: 'Sum of two numbers',
      code: `
        // Exercise 1: Write a function that returns the sum of two numbers
        function sum(a, b) {
          // Your code here
        }
      `,
      answer: `
        function sum(a, b) {
          return a + b;
        }
      `,
    });
    logger.info('Added block 1');

    await CodeBlock.create({
      name: 'Factorial of a number',
      code: `
        // Exercise 2: Write a function that returns the factorial of a number
        function factorial(n) {
          // Your code here
        }
      `,
      answer: `
        function factorial(n) {
          if (n === 0) {
            return 1;
          }
          return n * factorial(n - 1);
        }
      `,
    });
    logger.info('Added block 2');

    await CodeBlock.create({
      name: 'Palindrome',
      code: `
        // Exercise 3: Write a function that checks if a string is a palindrome
        function isPalindrome(str) {
          // Your code here
        }
      `,
      answer: `
        function isPalindrome(str) {
          const reversed = str.split('').reverse().join('');
          return str === reversed;
        }
      `,
    });
    logger.info('Added block 3');

    await CodeBlock.create({
      name: 'Find Fibonacci sequence',
      code: `
        // Exercise 4: Write a function that returns the Fibonacci sequence up to n
        function fibonacci(n) {
          // Your code here
        }
      `,
      answer: `
        function fibonacci(n) {
          const sequence = [0, 1];
          for (let i = 2; i < n; i++) {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
          }
          return sequence;
        }
      `,
    });
    logger.info('Added block 4');

    logger.info('Initial exercises added to MongoDB');
  } 
  catch (error) {
    logger.error('Error adding initial values:', error);
    throw error;
  }
}
