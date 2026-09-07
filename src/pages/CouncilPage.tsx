import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Box, Chip, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import PageHero from '../components/PageHero';
import SectionCard from '../components/SectionCard';
import type { CouncilMember } from '../data/siteContent';
import { councilContent, siteMeta } from '../data/siteContent';

function CouncilPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Arcane Council"
        title="The admin structure behind cluster balance, support, and long-term direction."
        description="This page turns the old static roster into a structured, maintainable team view with dedicated sections for leadership, support staff, automation, and operating principles."
        primaryAction={{ label: 'Join the Discord', href: siteMeta.discordUrl, external: true }}
        secondaryAction={{ label: 'Read Rules', href: '/server-info' }}
      />

      <Container maxWidth="xl" sx={{ mt: -7, position: 'relative', zIndex: 2, pb: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SectionCard sx={{ p: { xs: 3, md: 5 }, overflow: 'hidden' }}>
              <Grid container spacing={4} alignItems="flex-start">
                <Grid item xs={12} md={4} lg={3.5}>
                  <Stack spacing={2.5} sx={{ position: { md: 'sticky' }, top: { md: 112 } }}>
                    <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 4.5 }}>
                      Council Archive
                    </Typography>
                    <Typography variant="sectionTitle">
                      The Arcane Council, presented like a curated hall of mastery.
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      This roster now follows the collectible visual rhythm of the reference helmet section: stronger card identity, tighter grouping, and clearer visual hierarchy for each member.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {councilContent.sections.map((section) => (
                        <Chip key={section.title} label={`${section.title} · ${section.members.length}`} color="primary" variant="outlined" />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8} lg={8.5}>
                  <Stack spacing={4}>
                    {councilContent.sections.map((section) => (
                      <Stack spacing={2.25} key={section.title}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                          <Box>
                            <Typography variant="sectionTitle" sx={{ fontSize: 'clamp(2rem, 3vw, 3.35rem)' }}>
                              {section.title}
                            </Typography>
                            <Typography color="text.secondary">
                              {section.members.length} member{section.members.length === 1 ? '' : 's'} in this council tier.
                            </Typography>
                          </Box>
                        </Stack>
                        <Grid container spacing={2.2}>
                          {section.members.map((member) => (
                            <Grid item xs={12} sm={6} lg={section.members.length === 1 ? 12 : 4} key={member.name}>
                              <CouncilMemberTile member={member} sectionTitle={section.title} />
                            </Grid>
                          ))}
                        </Grid>
                      </Stack>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard sx={{ height: '100%' }}>
              <Typography variant="sectionTitle" gutterBottom>
                Arcane Automation
              </Typography>
              <List disablePadding>
                {councilContent.automation.map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SmartToyIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} primaryTypographyProps={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard sx={{ height: '100%' }}>
              <Typography variant="sectionTitle" gutterBottom>
                The Arcane Principles
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {councilContent.principles.map((principle) => (
                  <Chip key={principle} label={principle} color="primary" variant="outlined" sx={{ height: 'auto', '& .MuiChip-label': { display: 'block', whiteSpace: 'normal', py: 1 } }} />
                ))}
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

type BoxTextProps = {
  member: CouncilMember;
};

type CouncilMemberTileProps = BoxTextProps & {
  sectionTitle: string;
};

function CouncilMemberTile({ member, sectionTitle }: CouncilMemberTileProps): JSX.Element {
  const tierLabel = sectionTitle === 'Realm Masters' ? 'Tier I' : sectionTitle === 'Supreme Wizard' ? 'Tier II' : 'Tier III';

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          background: '#121114',
          minHeight: 380,
          boxShadow: '0 26px 48px rgba(18, 15, 25, 0.18)',
          clipPath: 'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 32px 100%, 0 calc(100% - 32px))',
          transition: 'transform 180ms ease, border-color 180ms ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: 'rgba(201, 168, 106, 0.45)',
          },
          '&:hover .council-member-image': {
            transform: 'scale(1.04)',
            filter: 'brightness(0.42)',
          },
          '&:hover .council-member-overlay': {
            opacity: 1,
          },
          '&:hover .council-member-copy': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '@media (hover: none)': {
            '& .council-member-image': {
              filter: 'brightness(0.42)',
            },
            '& .council-member-overlay': {
              opacity: 1,
            },
            '& .council-member-copy': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top right, rgba(201, 168, 106, 0.16), transparent 26%), radial-gradient(circle at 20% 10%, rgba(111, 86, 161, 0.16), transparent 24%)',
          }}
        />
        <Box sx={{ position: 'relative', p: 2.2, pb: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.62)', letterSpacing: 2.8, textTransform: 'uppercase' }}>
            {sectionTitle}
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', px: 2.2, pt: 0.5, pb: 2.2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 290 }}>
          <Box
            component="img"
            className="council-member-image"
            src={member.image}
            alt={member.name}
            sx={{
              width: '100%',
              maxWidth: 228,
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '3px solid rgba(201, 168, 106, 0.72)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              transition: 'transform 320ms ease, filter 320ms ease',
            }}
          />
        </Box>

        <Box
          className="council-member-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10, 9, 13, 0.04) 0%, rgba(10, 9, 13, 0.52) 38%, rgba(10, 9, 13, 0.92) 100%)',
            opacity: 0,
            transition: 'opacity 260ms ease',
            pointerEvents: 'none',
          }}
        />

        <Box
          className="council-member-copy"
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            px: 2.2,
            pb: 2.1,
            pt: 6,
            opacity: 0,
            transform: 'translateY(18px)',
            transition: 'opacity 280ms ease, transform 280ms ease',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 1.5,
              minHeight: 62,
            }}
          >
            <Stack spacing={0.45} sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ color: '#f7f2e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {member.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: 0.7 }}>
                {member.role}
              </Typography>
            </Stack>
            <Typography sx={{ color: 'secondary.main', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {tierLabel}
            </Typography>
          </Box>
          <Typography sx={{ color: 'secondary.main', fontSize: '0.98rem', fontWeight: 700, mt: 1.15 }}>
            Council Member
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.45, fontSize: '0.86rem', mt: 0.8 }}>
            {member.duty}
          </Typography>
        </Box>
      </Box>
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -1,
          right: 25,
          width: 46,
          height: 46,
          borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          borderRight: '1px solid rgba(255, 255, 255, 0.16)',
          borderTopRightRadius: 24,
          backgroundColor: 'transparent',
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          left: -1,
          bottom: 0,
          width: 28,
          height: 28,
          borderBottomLeftRadius: 22,
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(201, 168, 106, 0.08)',
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: 54,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(201, 168, 106, 0.65), transparent)',
          opacity: 0.75,
        }}
      />
    </Box>
  );
}

export default CouncilPage;