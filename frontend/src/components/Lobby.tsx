"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, List, Card, CardActionArea, CardContent, CircularProgress, Alert, Paper, Box } from '@mui/material';

const Lobby: React.FC = () => {
  const router = useRouter();
  const [codeBlocks, setCodeBlocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCodeBlocks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/codeblocks`);
        const data = await response.json();
        if (response.ok) {
          setCodeBlocks(data.codeblocks.map((block: { name: string }) => block.name));
        } else {
          setError(data.message || 'Error fetching code blocks');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching code blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchCodeBlocks();
  }, []);

  const handleSelectBlock = (blockName: string) => {
    router.push(`/codeblock/${blockName}`);
  };

  if (loading) {
    return (
      <Box className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress style={{ color: 'white' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="container">
      <Typography variant="h3" gutterBottom align="center">
        Tom JS Exercises
      </Typography>
      <Typography variant="h5" gutterBottom align="center">
        Choose code block:
      </Typography>
      <Paper className="paper">
        <List>
          {codeBlocks.map((block) => (
            <Card key={block} style={{ marginBottom: '10px' }}>
              <CardActionArea onClick={() => handleSelectBlock(block)}>
                <CardContent>
                  <Typography variant="h6">{block}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Lobby;
