import { Server as HttpServer } from 'http';
import { Server as WebSocketServer, WebSocket } from 'ws';
import logger from '../logger';
import codeBlock from '../models/codeBlock';

interface Client {
  ws: WebSocket;
  userID: number;
  blockName: string;
}

let clients: Client[] = [];

export default function initSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    logger.info('Client connected');

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        handleEvent(ws, parsedMessage);
      } 
      catch (error: any) {
        logger.error('Error parsing message:', error.message);
      }
    });

    ws.on('close', () => {
      logger.info('Client disconnected');
      handleClientDisconnect(ws);
    });
  });
}

function handleEvent(ws: WebSocket, message: { event: string; data: any }) {
  logger.info(`Handling event: ${message.event} with data: ${JSON.stringify(message.data)}`);
  
  switch (message.event) {
    case 'joinBlock':
      handleJoinBlock(ws, message.data);
      break;
    case 'leaveBlock':
      handleLeaveBlock(message.data.userID);
      break;
    case 'codeChange':
      handleCodeChange(message.data);
      break;
    default:
      ws.send(JSON.stringify({ event: 'error', data: { message: 'Unknown event' } }));
      break;
  }
}

function handleJoinBlock(ws: WebSocket, blockName: string) {
  const userID = clients.length + 1;
  const client: Client = { ws, userID, blockName };

  clients.push(client);

  codeBlock.findOne({ name: blockName }).then((block) => {
    if (block) {
      logger.info(`User ${userID} joined block ${blockName}`);

      // Notify the joining user
      ws.send(JSON.stringify({
        event: 'joinedBlock',
        data: { code: block.code, userID }
      }));

      // Notify all other users in the block
      clients.forEach(c => {
        if (c.blockName === blockName && c.userID !== userID) {
          c.ws.send(JSON.stringify({
            event: 'anotherUserJoined'
          }));
        }
      });
    } else {
      ws.send(JSON.stringify({
        event: 'error',
        data: { message: 'Block not found' }
      }));
    }
  }).catch(error => {
    logger.error(`Error finding block: ${error.message}`);
    ws.send(JSON.stringify({
      event: 'error',
      data: { message: 'Internal Server Error' }
    }));
  });
}

function handleLeaveBlock(userID: number) {
  logger.info(`Handling leave block for user ${userID}`);
  const index = clients.findIndex(client => client.userID === userID);
  handleClientLeave(index);
}

async function handleCodeChange(data: { code: string; userID: number }) {
  const client = clients.find(client => client.userID === data.userID);
  if (client) {
    logger.info(`User ${data.userID} changed code in block ${client.blockName}`);

    try {
      const block = await codeBlock.findOne({ name: client.blockName }).exec();
      if (block) {
        logger.info(`Expected answer: ${block.answer}`);
        logger.info(`Received code: ${data.code}`);
        
        if (block.answer === data.code) {
          logger.info('Code matches the expected answer');
          broadcastToBlock(client.blockName, {
            event: 'correctAnswer',
            data: { userID: data.userID, code: data.code }
          });
        } 
        else {
          logger.info('Code does not match the expected answer');
          broadcastToBlock(client.blockName, {
            event: 'codeChange',
            data: { code: data.code }
          });
        }
      } else {
        logger.error(`Block not found: ${client.blockName}`);
      }
    } catch (error:any) {
      logger.error(`Error fetching block: ${error.message}`);
    }
  }
}

function broadcastToBlock(blockName: string, message: { event: string; data: any }) {
  logger.info(`Broadcasting message to block ${blockName}: ${JSON.stringify(message)}`);
  clients
    .filter(client => client.blockName === blockName)
    .forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        logger.info(`Sending message to user ${client.userID}`);
        client.ws.send(JSON.stringify(message));
      } else {
        logger.warn(`WebSocket is not open for user ${client.userID}`);
      }
    });
}

function handleClientDisconnect(ws: WebSocket) {
  const index = clients.findIndex(client => client.ws === ws);
  handleClientLeave(index);
}

function handleClientLeave(index: number) {
  if (index !== -1) {
    const client = clients[index];
    const blockName = client.blockName;

    if(client.userID == 1){
      broadcastToBlock(blockName, {
        event: 'endSession',
        data: {}
      });
      clients = clients.filter(client => client.blockName !== blockName); // remove all users from block
      logger.info(`All users left block ${blockName}`);
    }
    else{
      clients.splice(index, 1);
      logger.info(`User ${client.userID} left block ${blockName}`);
    }
  }
}
