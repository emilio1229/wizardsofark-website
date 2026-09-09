import { Box, Grid, Stack, Typography } from '@mui/material';
import type { NetworkSummary } from '../../features/servers/types/liveServers';
import { GlassPanel, StatusDot } from '../common/GlassPanel';
import { getStatusColour } from '../../utils/format';
import { woaTokens } from '../../theme/tokens';
import { formatRelativeTime } from '../../features/servers/utils/time';

type ServerStatusSummaryProps = {
  networkName: string;
  summary: NetworkSummary;
  lastSuccessfulPoll: string | null;
  nowMs?: number;
};

export function ServerStatusSummary({
  networkName,
  summary,
  lastSuccessfulPoll,
  nowMs = Date.now(),
}: ServerStatusSummaryProps): JSX.Element {
  const statusCards = [
    { label: 'Online', value: summary.online, colour: woaTokens.colours.status.online },
    { label: 'Restarting', value: summary.restarting, colour: woaTokens.colours.status.restarting },
    {
      label: 'Possibly Updating',
      value: summary.possiblyUpdating,
      colour: woaTokens.colours.status.possiblyUpdating,
    },
    { label: 'Offline', value: summary.offline, colour: woaTokens.colours.status.offline },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={0.75} sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          {networkName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ARK: Survival Ascended Server Network
        </Typography>
        <Typography variant="body2" color="text.muted">
          Last updated {formatRelativeTime(lastSuccessfulPoll, nowMs)} · {summary.totalServers} realms
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {statusCards.map((card) => (
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

        <Grid item xs={12}>
          <GlassPanel sx={{ py: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <StatusDot colour={woaTokens.colours.secondary.main} />
                <Typography variant="body2" color="text.secondary">
                  Players Online
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ color: woaTokens.colours.secondary.main }}>
                {summary.currentPlayers}
              </Typography>
            </Stack>
          </GlassPanel>
        </Grid>
      </Grid>
    </Box>
  );
}

export function StatusLegend(): JSX.Element {
  const items = [
    { label: 'Online', colour: getStatusColour('online') },
    { label: 'Restarting', colour: getStatusColour('restarting') },
    { label: 'Possibly Updating', colour: getStatusColour('possibly_updating') },
    { label: 'Offline', colour: getStatusColour('offline') },
  ];

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      {items.map((item) => (
        <StatusDot key={item.label} colour={item.colour} label={item.label} />
      ))}
    </Stack>
  );
}
