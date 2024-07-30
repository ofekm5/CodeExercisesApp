"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Editor } from '@monaco-editor/react';

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
    const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_URL}/ws`);
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
          if (correctAnswer) {
            setCorrectAnswer(false);
          }
          setCode(message.data.code);
          break;
        case 'correctAnswer':
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

  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode || '');
    if (correctAnswer) {
      setCorrectAnswer(false);
    }
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event: 'codeChange', data: { blockName, code: newCode, userID } }));
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {blockName}
      </Typography>
      {correctAnswer && <Box component="span" fontSize="2rem" role="img" aria-label="smiley">😊</Box>}
      <Paper elevation={3}>
        <Editor
          height="600px"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{
            readOnly: role === 'mentor',
            automaticLayout: true,
          }}
        />
      </Paper>
      <Box mt={2}>
        <Typography variant="body1">Role: {role}</Typography>
        <Typography variant="body1">Students in room: {studentsCount}</Typography>
      </Box>
    </Container>
  );
};

export default CodeBlock;
