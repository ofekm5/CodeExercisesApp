import mongoose from 'mongoose';
import logger from '../logger';
import codeBlock from './codeBlock';

export default function initMongoDB() {
  connectToMongoDB();
  addInitValues();
}

function connectToMongoDB() {
  mongoose.connect('mongodb://localhost:27017/mydb').then(() => {
    logger.info('Connected to MongoDB');
  }).catch((error) => {
    logger.error('Connection error:', error.message);
  });
}

function addInitValues() {
  codeBlock.create({
    name: 'block1',
    code: `
      // Exercise 1: Write a function that returns the sum of two numbers
      function sum(a, b) {
        // Your code here
      }
    `,
    solution: `
      function sum(a, b) {
        return a + b;
      }
    `,
  });

  codeBlock.create({
    name: 'block2',
    code: `
      // Exercise 2: Write a function that returns the factorial of a number
      function factorial(n) {
        // Your code here
      }
    `,
    solution: `
      function factorial(n) {
        if (n === 0) {
          return 1;
        }
        return n * factorial(n - 1);
      }
    `,
  });

  codeBlock.create({
    name: 'block3',
    code: `
      // Exercise 3: Write a function that checks if a string is a palindrome
      function isPalindrome(str) {
        // Your code here
      }
    `,
    solution: `
      function isPalindrome(str) {
        const reversed = str.split('').reverse().join('');
        return str === reversed;
      }
    `,
  });

  codeBlock.create({
    name: 'block4',
    code: `
      // Exercise 4: Write a function that returns the Fibonacci sequence up to n
      function fibonacci(n) {
        // Your code here
      }
    `,
    solution: `
      function fibonacci(n) {
        const sequence = [0, 1];
        for (let i = 2; i < n; i++) {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        return sequence;
      }
    `,
  });

  logger.info('init exercises added to MongoDB');
}
