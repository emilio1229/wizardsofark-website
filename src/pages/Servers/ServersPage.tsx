import { Alert, Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SectionHeader } from '../../components/common/GlassPanel';
import { ServerCard, ServerCardSkeleton } from '../../components/server/ServerCard';
import { ServerStatusSummary, StatusLegend } from '../../components/server/ServerStatusSummary';
import { useServersNetwork } from '../../hooks/useApi';
import { formatRelativeTime, useRelativeClock } from '../../features/servers/utils/time';
import { woaTokens } from '../../theme/tokens';

function ServersPage(): JSX.Element {
  const { data, isLoading, isError, isFetching, dataUpdatedAt, refetch } = useServersNetwork();
  const nowMs = useRelativeClock(1000);
  const network = data?.status === 'success' ? data.data : null;
  const servers = network?.servers ?? [];
  const showStaleWarning =
    isError ||
    data?.status === 'error' ||
    (network !== null && network.masterListStatus !== 'healthy');

  const lastPollLabel = formatRelativeTime(
    network?.lastSuccessfulPoll ?? (dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null),
    nowMs,
  );

  return (
    <Container
      maxWidth={false}
      sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }}
    >
      <SectionHeader
        title="OUR SERVERS"
        subtitle="Explore our ARK ASA worlds. Live status is discovered from the public unofficial server list."
        action={
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <StatusLegend />
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              Refresh
            </Button>
          </Stack>
        }
      />

      {isLoading ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Loading realm status…
        </Typography>
      ) : null}

      {showStaleWarning ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Live server data temporarily unavailable.
          {network?.lastSuccessfulPoll || dataUpdatedAt
            ? ` Last successful update: ${lastPollLabel}.`
            : null}{' '}
          Showing the last known server information when available.
        </Alert>
      ) : null}

      {network ? (
        <ServerStatusSummary
          networkName={network.network}
          summary={network.summary}
          lastSuccessfulPoll={network.lastSuccessfulPoll}
          nowMs={nowMs}
        />
      ) : null}

      <Grid container spacing={2.5}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={3} key={`skeleton-${index}`}>
                <ServerCardSkeleton />
              </Grid>
            ))
          : null}

        {!isLoading && servers.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ py: 4 }}>
              <Typography color="text.secondary">
                No Wizards of Ark servers have been discovered yet. The monitor will add matching
                realms automatically once they appear in the public ASA list.
              </Typography>
            </Box>
          </Grid>
        ) : null}

        {servers.map((server) => (
          <Grid item xs={12} sm={6} lg={3} key={server.id}>
            <ServerCard server={server} nowMs={nowMs} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ServersPage;
