import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GlassPanel } from '../components/common/GlassPanel';

function NotFoundPage(): JSX.Element {
  return (
    <Container sx={{ py: 10, maxWidth: 720 }}>
      <GlassPanel sx={{ textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: 'gold.main' }}>
          Lost in the Realm
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, mb: 2 }}>
          404
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This path does not exist in the Wizards of Ark portal.
        </Typography>
        <Box>
          <Button component={RouterLink} to="/" variant="contained">
            Return Home
          </Button>
        </Box>
      </GlassPanel>
    </Container>
  );
}

export default NotFoundPage;
