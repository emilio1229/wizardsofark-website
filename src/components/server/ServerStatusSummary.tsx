import { Grid, Stack, Typography } from '@mui/material';
import type { ServerSummary } from '../../types';
import { GlassPanel, StatusDot } from '../common/GlassPanel';
import { getStatusColour } from '../../utils/format';
import { woaTokens } from '../../theme/tokens';

type ServerStatusSummaryProps = {
  servers: ServerSummary[];
};

export function ServerStatusSummary({ servers }: ServerStatusSummaryProps): JSX.Element {
  const online = servers.filter((s) => s.status === 'online').length;
  const offline = servers.filter((s) => s.status === 'offline').length;
  const playersOnline = servers.reduce((sum, s) => sum + (s.status === 'online' ? s.players : 0), 0);

  const cards = [
    { label: 'Online Servers', value: online, colour: woaTokens.colours.status.online },
    { label: 'Offline Servers', value: offline, colour: woaTokens.colours.status.offline },
    { label: 'Players Online', value: playersOnline, colour: woaTokens.colours.secondary.main },
    { label: 'Total Servers', value: servers.length, colour: woaTokens.colours.gold.main },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid item xs={6} md={3} key={card.label}>
          <GlassPanel sx={{ py: 2 }}>
            <Stack spacing={1}>
              <StatusDot colour={card.colour} />
              <Typography variant="h4" sx={{ color: card.colour }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
            </Stack>
          </GlassPanel>
        </Grid>
      ))}
    </Grid>
  );
}

export function StatusLegend(): JSX.Element {
  const items = [
    { label: 'Online', colour: getStatusColour('online') },
    { label: 'Offline', colour: getStatusColour('offline') },
    { label: 'Restarting', colour: getStatusColour('restarting') },
    { label: 'Maintenance', colour: getStatusColour('maintenance') },
  ];

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      {items.map((item) => (
        <StatusDot key={item.label} colour={item.colour} label={item.label} />
      ))}
    </Stack>
  );
}
