import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getMapById } from '../../api/servers';
import { GlassPanel, StatusDot } from '../../components/common/GlassPanel';
import { PlayerCount } from '../../components/server/PlayerCount';
import { useServer } from '../../hooks/useApi';
import { formatDateTime, formatStatusLabel, getStatusColour } from '../../utils/format';
import { formatConnection, formatRelativeTime, formatUtilization, useRelativeClock } from '../../features/servers/utils/time';
import { woaTokens } from '../../theme/tokens';

const tabs = ['Overview', 'Status History', 'Settings', 'Mods', 'Rules', 'Map Info'] as const;

function ServerDetailPage(): JSX.Element {
  const { serverId: rawServerId = '' } = useParams();
  const serverId = decodeURIComponent(rawServerId);
  const { data, isLoading, isError, refetch, isFetching } = useServer(serverId);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const nowMs = useRelativeClock(1000);

  const server = data?.status === 'success' ? data.data : null;
  const map = server ? getMapById(server.mapId) : undefined;

  const joinAddress = useMemo(() => {
    if (!server) {
      return '';
    }
    return formatConnection(server.ip, server.gamePort ?? server.port);
  }, [server]);

  const copyIp = async () => {
    if (!joinAddress) {
      return;
    }
    try {
      await navigator.clipboard.writeText(`${server?.ip}:${server?.gamePort ?? server?.port}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="text.secondary">Loading realm status…</Typography>
      </Container>
    );
  }

  if (isError || data?.status === 'error') {
    return (
      <Container sx={{ py: 8 }}>
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()} disabled={isFetching}>
              Retry
            </Button>
          }
        >
          Live server data is temporarily unavailable.
        </Alert>
      </Container>
    );
  }

  if (!server) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Server not found
        </Typography>
        <Button component={RouterLink} to="/servers" startIcon={<ArrowBackIcon />}>
          Back to Servers
        </Button>
      </Container>
    );
  }

  const statusColour = getStatusColour(server.status);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 280, md: 360 },
          backgroundImage: map ? `url(${map.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'background.elevated',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, background: woaTokens.gradients.heroOverlayVertical }} />
        <Container
          maxWidth={false}
          sx={{
            position: 'relative',
            maxWidth: woaTokens.layout.contentMaxWidth,
            px: { xs: 2, md: 4 },
            pt: 3,
            pb: 4,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: { xs: 280, md: 360 },
          }}
        >
          <Button
            component={RouterLink}
            to="/servers"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start', mb: 'auto', color: 'text.secondary' }}
          >
            Back to Servers
          </Button>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            spacing={2}
          >
            <Box>
              <Typography variant="overline" sx={{ color: 'gold.main', letterSpacing: '0.14em' }}>
                {server.mapName ?? map?.name ?? server.mapId}
              </Typography>
              <Typography variant="heroTitle" sx={{ fontSize: { xs: '2rem', md: '3.2rem' } }}>
                {server.name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
                <StatusDot
                  colour={statusColour}
                  label={formatStatusLabel(server.status)}
                  pulse={server.status === 'online' || server.status === 'restarting'}
                />
                <Typography color="text.secondary">
                  {server.players} / {server.maxPlayers} Players
                </Typography>
                <Typography color="text.muted">
                  Utilisation {formatUtilization(server.playerUtilization ?? null)}
                </Typography>
              </Stack>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" size="large" onClick={() => void copyIp()}>
                Copy Join Address
              </Button>
              <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => void copyIp()}>
                Copy IP
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth={false}
        sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: 4 }}
      >
        {server.statusExplanation ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {server.statusExplanation}
          </Alert>
        ) : null}

        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3, borderBottom: `1px solid ${woaTokens.colours.border.default}` }}
        >
          {tabs.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>

        {tab === 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <GlassPanel>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Live Status
                </Typography>
                <Stack spacing={1.75}>
                  {[
                    { label: 'Full Name', value: server.name },
                    { label: 'Map', value: server.mapName ?? map?.name ?? 'Unavailable' },
                    { label: 'Status', value: formatStatusLabel(server.status) },
                    { label: 'Players', value: `${server.players} / ${server.maxPlayers}` },
                    {
                      label: 'Player Utilisation',
                      value: formatUtilization(server.playerUtilization ?? null),
                    },
                    { label: 'IP', value: server.ip },
                    { label: 'Game Port', value: String(server.gamePort ?? server.port) },
                    {
                      label: 'Query Port',
                      value: server.queryPort ? String(server.queryPort) : 'Unavailable',
                    },
                    { label: 'Version / Build', value: server.version || 'Unavailable' },
                    {
                      label: 'First Seen',
                      value: server.firstSeen ? formatDateTime(server.firstSeen) : 'Unavailable',
                    },
                    {
                      label: 'Last Seen',
                      value: server.lastSeen
                        ? `${formatDateTime(server.lastSeen)} (${formatRelativeTime(server.lastSeen, nowMs)})`
                        : 'Unavailable',
                    },
                    {
                      label: 'Last Checked',
                      value: server.lastChecked
                        ? `${formatDateTime(server.lastChecked)} (${formatRelativeTime(server.lastChecked, nowMs)})`
                        : 'Unavailable',
                    },
                    { label: 'Game Mode', value: server.gameMode ?? 'Unavailable' },
                    { label: 'Join Address', value: joinAddress },
                  ].map((row) => (
                    <Stack
                      key={row.label}
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ borderBottom: `1px solid ${woaTokens.colours.border.default}`, pb: 1.25 }}
                    >
                      <Typography color="text.muted">{row.label}</Typography>
                      <Typography fontWeight={600} textAlign="right">
                        {row.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <PlayerCount players={server.players} maxPlayers={server.maxPlayers} />
                </Box>
              </GlassPanel>
            </Grid>
            <Grid item xs={12} md={5}>
              <GlassPanel sx={{ height: '100%' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Observation Notes
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Status is derived from presence in the public ASA unofficial server list. Absence
                  does not confirm a crash, update, or network issue on its own.
                </Typography>
                {server.missingSince ? (
                  <Typography color="text.muted">
                    Missing since {formatDateTime(server.missingSince)} (
                    {formatRelativeTime(server.missingSince, nowMs)})
                  </Typography>
                ) : (
                  <Typography color="text.muted">Currently present in the latest successful poll.</Typography>
                )}
              </GlassPanel>
            </Grid>
          </Grid>
        ) : null}

        {tab === 1 ? (
          <GlassPanel>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Recent Status History
            </Typography>
            {(server.statusHistory ?? []).length === 0 ? (
              <Typography color="text.secondary">No transitions recorded yet.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {(server.statusHistory ?? []).map((entry, index) => (
                  <Stack
                    key={`${entry.observedAt}-${index}`}
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ borderBottom: `1px solid ${woaTokens.colours.border.default}`, pb: 1.25 }}
                  >
                    <Box>
                      <StatusDot
                        colour={getStatusColour(entry.toStatus)}
                        label={`${entry.fromStatus ? formatStatusLabel(entry.fromStatus) : 'New'} → ${formatStatusLabel(entry.toStatus)}`}
                      />
                      {entry.note ? (
                        <Typography variant="caption" color="text.muted" sx={{ display: 'block', mt: 0.5 }}>
                          {entry.note}
                        </Typography>
                      ) : null}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(entry.observedAt)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </GlassPanel>
        ) : null}

        {tab === 2 ? (
          <GlassPanel>
            {server.settings.length === 0 ? (
              <Typography color="text.secondary">Settings are not available from the public ASA list.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {server.settings.map((setting) => (
                  <Stack key={setting.label} direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">{setting.label}</Typography>
                    <Typography fontWeight={600}>{setting.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </GlassPanel>
        ) : null}

        {tab === 3 ? (
          <GlassPanel>
            {server.mods.length === 0 ? (
              <Typography color="text.secondary">Mod details are not available from the public ASA list.</Typography>
            ) : (
              <Stack spacing={1}>
                {server.mods.map((mod) => (
                  <Typography key={mod} color="text.secondary">
                    • {mod}
                  </Typography>
                ))}
              </Stack>
            )}
          </GlassPanel>
        ) : null}

        {tab === 4 ? (
          <GlassPanel>
            <Stack spacing={1.25}>
              {server.rules.map((rule) => (
                <Typography key={rule} color="text.secondary">
                  • {rule}
                </Typography>
              ))}
            </Stack>
          </GlassPanel>
        ) : null}

        {tab === 5 ? (
          <GlassPanel>
            <Typography variant="h5" gutterBottom>
              {server.mapName ?? map?.name ?? server.name}
            </Typography>
            <Typography color="text.secondary">{server.description}</Typography>
          </GlassPanel>
        ) : null}
      </Container>

      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} message="Server IP copied" />
    </>
  );
}

export default ServerDetailPage;
