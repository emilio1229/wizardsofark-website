import { Avatar, Box, LinearProgress, Stack, Typography } from '@mui/material';
import type { PlayerSummary } from '../../types';
import { formatPlayerCount } from '../../utils/format';
import { GlassPanel } from '../common/GlassPanel';

type PlayerCountProps = {
  players: number;
  maxPlayers: number;
};

export function PlayerCount({ players, maxPlayers }: PlayerCountProps): JSX.Element {
  const pct = maxPlayers > 0 ? Math.round((players / maxPlayers) * 100) : 0;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {formatPlayerCount(players, maxPlayers)}
        </Typography>
        <Typography variant="body2" color="text.muted">
          {pct}% full
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={pct} sx={{ height: 8 }} />
    </Box>
  );
}

type PlayerAvatarListProps = {
  players: PlayerSummary[];
  title?: string;
};

export function PlayerAvatarList({ players, title = 'Recent Players' }: PlayerAvatarListProps): JSX.Element {
  return (
    <GlassPanel sx={{ height: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {players.length === 0 ? (
        <Typography color="text.secondary">No recent players to show.</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
            gap: 2,
          }}
        >
          {players.map((player) => (
            <Stack key={player.id} alignItems="center" spacing={0.75}>
              <Avatar
                src={player.avatar}
                alt={player.name}
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: 'primary.dark',
                  border: '1px solid',
                  borderColor: 'border.default',
                }}
              >
                {player.name.slice(0, 1)}
              </Avatar>
              <Typography variant="caption" color="text.secondary" textAlign="center" noWrap sx={{ maxWidth: 88 }}>
                {player.name}
              </Typography>
            </Stack>
          ))}
        </Box>
      )}
    </GlassPanel>
  );
}
