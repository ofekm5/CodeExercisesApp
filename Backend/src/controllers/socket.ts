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

function broadcastIfAnswerIsCorrect(userID: number, code: string, blockName: string) { 
  codeBlock.findOne({ name: blockName }).then((block) => {
    if (block && block.answer === code) {
      broadcastToBlock(blockName, {
        event: 'correctAnswer',
        data: { userID: userID }
      });
    }
  });
}

function handleJoinBlock(ws: WebSocket, blockName: string) {
  const userID = clients.length + 1;
  const client: Client = { ws, userID, blockName };
  
  clients.push(client);
  logger.info(`User ${userID} joined block ${blockName}`);

  codeBlock.findOne({ name: blockName }).then((block) => {
    if (block) {
      ws.send(JSON.stringify({
        event: 'joinedBlock',
        data: { code: block.code, userID }
      }));
    } else {
      ws.send(JSON.stringify({
        event: 'error',
        data: { message: 'Block not found' }
      }));
    }
  });
}

function handleLeaveBlock(userID: number) {
  const index = clients.findIndex(client => client.userID === userID);
  handleClientLeave(index);
}

function handleCodeChange(data: { code: string; userID: number }) {
  const client = clients.find(client => client.userID === data.userID);
  if (client) {
    logger.info(`User ${data.userID} changed code in block ${client.blockName}`);

    broadcastToBlock(client.blockName, {
      event: 'codeChange',
      data: { code: data.code }
    });
    broadcastIfAnswerIsCorrect(data.userID, data.code, client.blockName);
  }
}

function broadcastToBlock(blockName: string, message: { event: string; data: any }) {
  clients
    .filter(client => client.blockName === blockName)
    .forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
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
