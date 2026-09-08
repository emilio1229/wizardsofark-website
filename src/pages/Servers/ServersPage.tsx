import { Alert, Container, Grid, Typography } from '@mui/material';
import { SectionHeader } from '../../components/common/GlassPanel';
import { ServerCard, ServerCardSkeleton } from '../../components/server/ServerCard';
import { ServerStatusSummary, StatusLegend } from '../../components/server/ServerStatusSummary';
import { useServers } from '../../hooks/useApi';
import { woaTokens } from '../../theme/tokens';

function ServersPage(): JSX.Element {
  const { data, isLoading, isError, dataUpdatedAt } = useServers();
  const servers = data?.status === 'success' ? data.data : [];
  const updatedLabel = dataUpdatedAt
    ? `Last updated ${new Date(dataUpdatedAt).toLocaleTimeString()}`
    : undefined;

  return (
    <Container
      maxWidth={false}
      sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }}
    >
      <SectionHeader
        title="OUR SERVERS"
        subtitle="Explore our ARK ASA worlds. View live server status, players and server information."
        action={<StatusLegend />}
      />

      {isError || data?.status === 'error' ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Live server data is temporarily unavailable. {updatedLabel}
        </Alert>
      ) : null}

      {!isLoading && servers.length > 0 ? <ServerStatusSummary servers={servers} /> : null}

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
            <Typography color="text.secondary">No servers are configured yet.</Typography>
          </Grid>
        ) : null}

        {servers.map((server) => (
          <Grid item xs={12} sm={6} lg={3} key={server.id}>
            <ServerCard server={server} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ServersPage;
