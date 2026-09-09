import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { CouncilBackground } from '../../components/council/CouncilBackground';
import { CouncilConstellation } from '../../components/council/CouncilConstellation';
import { CouncilCrest } from '../../components/council/CouncilCrest';
import { CouncilMemberCarousel } from '../../components/council/CouncilMemberCarousel';
import { CouncilMemberPanel } from '../../components/council/CouncilMemberPanel';
import { GlassPanel } from '../../components/common/GlassPanel';
import { useCouncil } from '../../hooks/useApi';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  DEFAULT_COUNCIL_MEMBER_ID,
  councilPrinciples,
  getCouncilMemberById,
} from '../../data/council';
import { siteMeta } from '../../data/site';
import { woaTokens } from '../../theme/tokens';

function CouncilPage(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const reducedMotion = usePrefersReducedMotion();
  const { data, isLoading, isError } = useCouncil();
  const members = data?.status === 'success' ? data.data : [];

  const [selectedId, setSelectedId] = useState(DEFAULT_COUNCIL_MEMBER_ID);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const resolvedSelectedId = useMemo(() => {
    if (members.some((member) => member.id === selectedId)) {
      return selectedId;
    }
    if (members.some((member) => member.id === DEFAULT_COUNCIL_MEMBER_ID)) {
      return DEFAULT_COUNCIL_MEMBER_ID;
    }
    return members[0]?.id ?? DEFAULT_COUNCIL_MEMBER_ID;
  }, [members, selectedId]);

  const selectedMember = getCouncilMemberById(members, resolvedSelectedId) || members[0];
  const energyColor = selectedMember?.energyColor || woaTokens.colours.primary.main;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Full-viewport council stage */}
      <Box
        sx={{
          // Pull under the fixed header so the artwork is truly edge-to-edge
          mt: { xs: '-64px', md: '-72px' },
        }}
      >
        <CouncilBackground
          energyColor={energyColor}
          fullBleed
          minHeight={{ xs: '100svh', md: '100dvh' }}
        >
          <Container
            maxWidth={false}
            sx={{
              maxWidth: woaTokens.layout.maxWidth,
              px: { xs: 2, md: 4 },
              pt: { xs: '88px', md: '104px' },
              pb: { xs: 4, md: 5 },
              minHeight: 'inherit',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack
              spacing={1.25}
              alignItems="center"
              textAlign="center"
              sx={{ mb: { xs: 2.5, md: 3 }, maxWidth: 720, mx: 'auto' }}
            >
              <Typography variant="overline" sx={{ color: 'gold.main' }}>
                Arcane Circle
              </Typography>
              <Typography variant="sectionTitle" component="h1">
                THE COUNCIL
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: 'gold.light', fontFamily: '"Cinzel", Georgia, serif', fontWeight: 500 }}
              >
                Guiding the Realm Together
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                The Council shapes, protects and grows the Wizards of Ark realm. Select a member to discover
                their role within the community.
              </Typography>
              <Typography
                sx={{
                  color: energyColor,
                  fontFamily: '"Cinzel", Georgia, serif',
                  letterSpacing: '0.08em',
                  transition: `color ${woaTokens.motion.slow}ms ease`,
                }}
              >
                {siteMeta.councilPhrase}
              </Typography>
            </Stack>

            {isError || data?.status === 'error' ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Council data is temporarily unavailable.
              </Alert>
            ) : null}

            {isLoading || !selectedMember ? (
              <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 2, flexGrow: 1 }} />
            ) : isMobile ? (
              <Stack spacing={3} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                <Stack spacing={2} alignItems="center">
                  <CouncilCrest energyColor={energyColor} pulsing size={150} reducedMotion={reducedMotion} />
                  <Typography
                    textAlign="center"
                    sx={{ color: 'gold.light', fontFamily: '"Cinzel", Georgia, serif' }}
                  >
                    Different Powers.
                    <br />
                    One Purpose.
                  </Typography>

                  <Box sx={{ position: 'relative', width: 4, height: 36 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 2,
                        background: `linear-gradient(180deg, ${energyColor}, transparent)`,
                        boxShadow: `0 0 12px ${alpha(energyColor, 0.55)}`,
                      }}
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <CouncilMemberCarousel
                      members={members}
                      selectedId={resolvedSelectedId}
                      onSelect={setSelectedId}
                    />
                  </Box>
                </Stack>

                <CouncilMemberPanel member={selectedMember} />
              </Stack>
            ) : (
              <Grid container spacing={3} alignItems="center" sx={{ flexGrow: 1 }}>
                <Grid item xs={12} lg={8}>
                  <Box
                    sx={{
                      minHeight: { md: 720, lg: 960 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 2,
                    }}
                  >
                    <CouncilConstellation
                      members={members}
                      selectedId={resolvedSelectedId}
                      hoveredId={hoveredId}
                      onSelect={setSelectedId}
                      onHover={setHoveredId}
                      compact={!isDesktop}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 }, maxWidth: { md: 520, lg: 'none' }, mx: { md: 'auto', lg: 0 } }}>
                    <CouncilMemberPanel member={selectedMember} />
                  </Box>
                </Grid>
              </Grid>
            )}

            <GlassPanel sx={{ mt: { xs: 3, md: 4 }, mb: { xs: 2, md: 3 } }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Operating Principles
              </Typography>
              <Stack spacing={1}>
                {councilPrinciples.map((principle) => (
                  <Typography key={principle} color="text.secondary">
                    • {principle}
                  </Typography>
                ))}
              </Stack>
            </GlassPanel>
          </Container>
        </CouncilBackground>
      </Box>
    </Box>
  );
}

export default CouncilPage;
