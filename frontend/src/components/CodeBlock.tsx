import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import MonacoEditor, { ReactMonacoEditorProps } from 'react-monaco-editor';
import { Container, Typography, Paper, Box, Alert } from '@mui/material';

const socket = io('http://localhost:5000');

const CodeBlock: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const blockName = params.blockName as string; // Ensure blockName is treated as a string
  const [code, setCode] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean>(false);

  useEffect(() => {
    const userRole = prompt("Enter your role (mentor/student)");
    setRole(userRole || '');
    socket.emit('joinBlock', { blockName, role: userRole });

    socket.on('joinedBlock', ({ code, userID }) => {
      setCode(code);
    });

    socket.on('codeChange', ({ code }) => setCode(code));

    socket.on('updateUsers', ({ mentor, students }) => {
      setStudentsCount(students.length);
    });

    socket.on('mentorLeft', () => {
      if (role === 'student') {
        alert('Mentor left, redirecting to lobby.');
        router.push('/');
      }
    });

    socket.on('correctAnswer', () => {
      setCorrectAnswer(true);
    });

    socket.on('endSession', () => {
      alert('The session has ended. Redirecting to lobby.');
      router.push('/');
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [blockName, role, router]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    socket.emit('codeChange', { blockName, code: newCode });
  };

  const options: ReactMonacoEditorProps['options'] = {
    readOnly: role === 'mentor',
    automaticLayout: true,
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {blockName}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {correctAnswer && <Alert severity="success">Correct Answer!</Alert>}
      <Paper elevation={3}>
        <MonacoEditor
          width="100%"
          height="600"
          language="javascript"
          theme="vs-dark"
          value={code}
          options={options}
          onChange={handleCodeChange}
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
