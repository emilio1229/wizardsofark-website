import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

export default function DiscordAuthPage(): JSX.Element {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
    const invite = searchParams.get('invite');
    const query = invite ? `?invite=${encodeURIComponent(invite)}` : '';
    window.location.assign(`${apiUrl}/auth/discord${query}`);
  }, [searchParams]);

  return (
    <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', gap: 2 }}>
      <CircularProgress color="primary" />
      <Typography color="text.secondary">Connecting to Discord...</Typography>
    </Box>
  );
}
