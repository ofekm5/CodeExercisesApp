"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Typography, Paper, Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodeBlock: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const blockName = decodeURIComponent(params.blockName as string); // Ensure blockName is decoded
  const [code, setCode] = useState<string>('');
  const [role, setRole] = useState<string>('student'); // Default to 'student'
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [correctAnswer, setCorrectAnswer] = useState<boolean>(false);
  const [userID, setuserID] = useState<number>(0);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('wss://terrific-connection-production.up.railway.app');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send(JSON.stringify({ event: 'joinBlock', data: blockName }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      switch (message.event) {
        case 'joinedBlock':
          setCode(message.data.code);
          setuserID(message.data.userID);
          if (message.data.userID === 1) { // Assuming the first user (userID === 1) is the mentor
            setRole('mentor');
          } else {
            setStudentsCount((prevCount) => prevCount + 1);
          }
          break;
        case 'anotherUserJoined':
          setStudentsCount((prevCount) => prevCount + 1);
          break;
        case 'codeChange':
          setCode(message.data.code);
          break;
        case 'correctAnswer':
          setCode(message.data.code);
          setCorrectAnswer(true);
          break;
        case 'endSession':
          alert('The session has ended. Redirecting to lobby.');
          router.push('/');
          break;
        case 'error':
          console.error(message.data.message);
          break;
        default:
          console.error('Unknown event:', message.event);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [blockName, role, router]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event: 'codeChange', data: { blockName, code: value, userID } }));
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {blockName}
      </Typography>
      <Paper elevation={3}>
        <CodeMirror
          value={code}
          height="600px"
          extensions={[javascript()]}
          onChange={handleCodeChange}
          theme="dark"
          editable={role !== 'mentor'}
        />
      </Paper>
      {correctAnswer && <Box component="span" fontSize="2rem" role="img" aria-label="smiley">😊</Box>}
      <Box mt={2}>
        <Typography variant="body1" style={{ color: 'black' }}>Role: {role}</Typography>
        <Typography variant="body1" style={{ color: 'black' }}>Students in room: {studentsCount}</Typography>
      </Box>
    </Container>
  );
};

export default CodeBlock;
