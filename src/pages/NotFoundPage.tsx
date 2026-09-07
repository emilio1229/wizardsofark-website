import { Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SectionCard from '../components/SectionCard';

function NotFoundPage(): JSX.Element {
  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <SectionCard>
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="heroTitle">Lost Between Realms</Typography>
          <Typography color="text.secondary">
            The page you asked for does not exist in this route structure.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" color="primary">
            Return Home
          </Button>
        </Stack>
      </SectionCard>
    </Container>
  );
}

export default NotFoundPage;