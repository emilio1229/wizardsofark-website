import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link as RouterLink } from 'react-router-dom';
import type { ServerSummary } from '../../types';
import { getMapById } from '../../api/servers';
import { formatPlayerCount, formatStatusLabel, getStatusColour } from '../../utils/format';
import { StatusDot } from '../common/GlassPanel';
import { MapArtwork } from './MapArtwork';
import { woaTokens } from '../../theme/tokens';

type ServerCardProps = {
  server: ServerSummary;
};

export function ServerCard({ server }: ServerCardProps): JSX.Element {
  const map = getMapById(server.mapId);
  const statusColour = getStatusColour(server.status);

  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: woaTokens.glow.magic,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/servers/${server.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <MapArtwork src={map?.image} alt={server.name} height={160} label={server.name} />
        <CardContent sx={{ flexGrow: 1, pt: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {server.name}
              </Typography>
              <StatusDot colour={statusColour} label={formatStatusLabel(server.status)} pulse={server.status === 'online'} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
                {formatPlayerCount(server.players, server.maxPlayers)}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: `1px solid ${woaTokens.colours.border.default}`,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.light',
                flexShrink: 0,
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function ServerCardSkeleton(): JSX.Element {
  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={160} />
      <CardContent>
        <Skeleton width="60%" height={28} />
        <Skeleton width="40%" sx={{ mt: 1 }} />
        <Skeleton width="30%" sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
}
