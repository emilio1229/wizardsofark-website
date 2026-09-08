import { Alert, Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { PageHero } from '../../components/common/PageHero';
import { ActivityList, CommunityCard } from '../../components/community/CommunityCards';
import { GlassPanel } from '../../components/common/GlassPanel';
import { useCommunity } from '../../hooks/useApi';
import { siteMeta } from '../../data/site';
import { woaTokens } from '../../theme/tokens';

function CommunityPage(): JSX.Element {
  const { categories, activity } = useCommunity();
  const categoryItems = categories.data?.status === 'success' ? categories.data.data : [];
  const activityItems = activity.data?.status === 'success' ? activity.data.data : [];

  return (
    <>
      <PageHero
        title="COMMUNITY"
        subtitle="Events, guides, builds and everything in between."
        backgroundImage="/assets/gallery/gallery5.png"
        minHeight={{ xs: '40vh', md: '46vh' }}
        overlay="vertical"
      />

      <Container
        maxWidth={false}
        sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }}
      >
        {categories.isError || activity.isError ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Some community content is temporarily unavailable.
          </Alert>
        ) : null}

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {categoryItems.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <CommunityCard category={category} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ActivityList items={activityItems} />
          </Grid>
          <Grid item xs={12} md={4}>
            <GlassPanel sx={{ height: '100%' }}>
              <Stack spacing={2}>
                <Typography variant="h5">Discord</Typography>
                <Typography color="text.secondary">
                  Tickets, events, trading, and the heartbeat of the realm live on Discord.
                </Typography>
                <Box
                  sx={{
                    height: 120,
                    borderRadius: `${woaTokens.radius.md}px`,
                    background: woaTokens.gradients.cardHover,
                    border: `1px solid ${woaTokens.colours.border.default}`,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.light',
                    fontFamily: '"Cinzel", Georgia, serif',
                    letterSpacing: '0.08em',
                  }}
                >
                  WIZARDS OF ARK
                </Box>
                <Button variant="contained" href={siteMeta.discordUrl} target="_blank" rel="noreferrer">
                  Join Discord
                </Button>
              </Stack>
            </GlassPanel>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default CommunityPage;
