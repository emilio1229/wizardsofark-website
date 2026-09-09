import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link as RouterLink } from 'react-router-dom';
import type { LiveServer } from '../../features/servers/types/liveServers';
import { formatConnection, formatRelativeTime, formatUtilization } from '../../features/servers/utils/time';
import { getMapById } from '../../api/servers';
import { formatPlayerCount, formatStatusLabel, getStatusColour } from '../../utils/format';
import { StatusDot } from '../common/GlassPanel';
import { MapArtwork } from './MapArtwork';
import { woaTokens } from '../../theme/tokens';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type ServerCardProps = {
  server: LiveServer;
  nowMs?: number;
};

function statusGlow(status: LiveServer['status'], reducedMotion: boolean): string | undefined {
  if (reducedMotion) {
    return undefined;
  }
  const colour = getStatusColour(status);
  switch (status) {
    case 'online':
      return `0 0 18px ${alpha(colour, 0.28)}`;
    case 'restarting':
      return `0 0 16px ${alpha(colour, 0.35)}`;
    case 'possibly_updating':
      return `0 0 16px ${alpha(colour, 0.32)}`;
    case 'offline':
      return `0 0 14px ${alpha(colour, 0.22)}`;
    default:
      return undefined;
  }
}

export function ServerCard({ server, nowMs = Date.now() }: ServerCardProps): JSX.Element {
  const map = getMapById(server.mapId);
  const statusColour = getStatusColour(server.status);
  const reducedMotion = usePrefersReducedMotion();
  const players = server.players ?? 0;
  const maxPlayers = server.maxPlayers ?? 0;
  const utilizationPct =
    server.playerUtilization !== null && server.playerUtilization !== undefined
      ? Math.round(server.playerUtilization * 100)
      : maxPlayers > 0
        ? Math.round((players / maxPlayers) * 100)
        : 0;
  const pulse =
    !reducedMotion && (server.status === 'online' || server.status === 'restarting' || server.status === 'possibly_updating');
  const gameModeLabel = server.isPve === null ? null : server.isPve ? 'PvE' : 'PvP';
  const gameModeColour = server.isPve ? woaTokens.colours.secondary.main : woaTokens.colours.status.warning;

  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        borderColor: alpha(statusColour, 0.35),
        boxShadow: statusGlow(server.status, reducedMotion),
        transition: `transform ${woaTokens.motion.normal}ms ease, box-shadow ${woaTokens.motion.normal}ms ease`,
        animation:
          !reducedMotion && server.status === 'restarting'
            ? 'woa-status-pulse 2.8s ease-in-out infinite'
            : undefined,
        '@keyframes woa-status-pulse': {
          '0%, 100%': { boxShadow: `0 0 10px ${alpha(statusColour, 0.2)}` },
          '50%': { boxShadow: `0 0 22px ${alpha(statusColour, 0.4)}` },
        },
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: woaTokens.glow.magic,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/servers/${encodeURIComponent(server.id)}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <MapArtwork src={map?.image} alt={server.map} height={{ xs: 140, md: 160 }} label={server.map} />
        <CardContent sx={{ flexGrow: 1, pt: 1.5 }}>
          <Stack spacing={1.25}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
                  <Typography variant="h5">{server.map}</Typography>
                  {gameModeLabel ? (
                    <Chip
                      size="small"
                      label={gameModeLabel}
                      sx={{
                        height: 22,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: gameModeColour,
                        borderColor: alpha(gameModeColour, 0.45),
                        bgcolor: alpha(gameModeColour, 0.12),
                      }}
                      variant="outlined"
                    />
                  ) : null}
                </Stack>
                <StatusDot colour={statusColour} label={formatStatusLabel(server.status)} pulse={pulse} />
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

            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                <Typography variant="body2" color="text.secondary">
                  {formatPlayerCount(players, maxPlayers)} Players
                </Typography>
                <Typography variant="body2" color="text.muted">
                  {formatUtilization(server.playerUtilization)}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, Math.max(0, utilizationPct))}
                sx={{
                  height: 7,
                  borderRadius: 1,
                  bgcolor: alpha(statusColour, 0.12),
                  '& .MuiLinearProgress-bar': { bgcolor: statusColour },
                }}
              />
            </Box>

            <Stack spacing={0.35} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Typography variant="caption" color="text.muted">
                {formatConnection(server.ip, server.gamePort, server.queryPort)}
              </Typography>
              <Typography variant="caption" color="text.muted">
                Last checked {formatRelativeTime(server.lastChecked, nowMs)}
              </Typography>
              {server.version ? (
                <Typography variant="caption" color="text.muted">
                  Build {server.version}
                </Typography>
              ) : null}
            </Stack>
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
        <Skeleton width="40%" height={18} />
        <Skeleton width="75%" height={28} sx={{ mt: 1 }} />
        <Skeleton width="35%" sx={{ mt: 1 }} />
        <Skeleton width="100%" height={10} sx={{ mt: 2 }} />
        <Skeleton width="60%" sx={{ mt: 1.5 }} />
      </CardContent>
    </Card>
  );
}
