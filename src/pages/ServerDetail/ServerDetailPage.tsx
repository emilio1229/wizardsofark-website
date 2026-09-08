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
import { PlayerAvatarList, PlayerCount } from '../../components/server/PlayerCount';
import { useServer } from '../../hooks/useApi';
import { formatDateTime, formatStatusLabel, formatUptime, getStatusColour } from '../../utils/format';
import { woaTokens } from '../../theme/tokens';

const tabs = ['Overview', 'Players', 'Settings', 'Mods', 'Rules', 'Map Info'] as const;

function ServerDetailPage(): JSX.Element {
  const { serverId = '' } = useParams();
  const { data, isLoading, isError } = useServer(serverId);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const server = data?.status === 'success' ? data.data : null;
  const map = server ? getMapById(server.mapId) : undefined;

  const joinAddress = useMemo(() => {
    if (!server) {
      return '';
    }
    return `${server.ip}:${server.port}`;
  }, [server]);

  const copyIp = async () => {
    if (!joinAddress) {
      return;
    }
    try {
      await navigator.clipboard.writeText(joinAddress);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="text.secondary">Loading server…</Typography>
      </Container>
    );
  }

  if (isError || data?.status === 'error') {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="warning">Live server data is temporarily unavailable.</Alert>
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

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 280, md: 360 },
          backgroundImage: map ? `url(${map.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
              <Typography variant="heroTitle" sx={{ fontSize: { xs: '2.4rem', md: '3.5rem' } }}>
                {server.name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
                <StatusDot
                  colour={getStatusColour(server.status)}
                  label={formatStatusLabel(server.status)}
                  pulse={server.status === 'online'}
                />
                <Typography color="text.secondary">
                  {server.players} / {server.maxPlayers} Players
                </Typography>
              </Stack>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" size="large">
                Join Server
              </Button>
              <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={copyIp}>
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
                  Stats
                </Typography>
                <Stack spacing={1.75}>
                  {[
                    { label: 'IP Address', value: joinAddress },
                    { label: 'Map', value: server.name },
                    { label: 'Game Mode', value: server.gameMode },
                    { label: 'Status', value: formatStatusLabel(server.status) },
                    { label: 'Uptime', value: formatUptime(server.uptimeSeconds) },
                    { label: 'Server Version', value: server.version },
                    { label: 'Last Restart', value: formatDateTime(server.lastRestart) },
                    { label: 'Next Restart', value: formatDateTime(server.nextRestart) },
                  ].map((row) => (
                    <Stack
                      key={row.label}
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ borderBottom: `1px solid ${woaTokens.colours.border.default}`, pb: 1.25 }}
                    >
                      <Typography color="text.muted">{row.label}</Typography>
                      <Typography fontWeight={600}>{row.value}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <PlayerCount players={server.players} maxPlayers={server.maxPlayers} />
                </Box>
              </GlassPanel>
            </Grid>
            <Grid item xs={12} md={5}>
              <PlayerAvatarList players={server.recentPlayers} />
            </Grid>
          </Grid>
        ) : null}

        {tab === 1 ? <PlayerAvatarList players={server.recentPlayers} title="Players" /> : null}

        {tab === 2 ? (
          <GlassPanel>
            <Stack spacing={1.5}>
              {server.settings.map((setting) => (
                <Stack key={setting.label} direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">{setting.label}</Typography>
                  <Typography fontWeight={600}>{setting.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </GlassPanel>
        ) : null}

        {tab === 3 ? (
          <GlassPanel>
            <Stack spacing={1}>
              {server.mods.map((mod) => (
                <Typography key={mod} color="text.secondary">
                  • {mod}
                </Typography>
              ))}
            </Stack>
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
              {server.name}
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
