import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Alert } from '@mui/material';

const Lobby: React.FC = () => {
  const router = useRouter();
  const [codeBlocks, setCodeBlocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCodeBlocks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/codeblocks');
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
    router.push(`/api/codeblock/${blockName}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Choose code block
      </Typography>
      <Paper>
        <List>
          {codeBlocks.map((block) => (
            <ListItem button key={block} onClick={() => handleSelectBlock(block)}>
              <ListItemText primary={block} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Lobby;
