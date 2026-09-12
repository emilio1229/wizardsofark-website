import { Box, Grid, Typography } from '@mui/material';
import { homeFeatures } from '../../data/servers';
import { siteMeta } from '../../data/site';
import { PageHero } from '../../components/common/PageHero';
import { FeatureCard } from '../../components/community/CommunityCards';

function HomePage(): JSX.Element {
  return (
    <Box
      sx={{
        flex: { xs: 'none', md: 1 },
        minHeight: { xs: 'auto', md: 0 },
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <PageHero
        title=" THE WIZARDS OF ARK"
        subtitle={siteMeta.tagline}
        description={siteMeta.description}
        backgroundImage="/assets/community/media/skyforge-peak.png"
        fillParent
        overlayOpacity={0.6}
        titleOffset={{ xs: '18%', md: '28%' }}
        bottomGap={{ xs: 3, md: 'grow' }}
        primaryAction={{ label: 'View Servers', href: '/servers' }}
        secondaryAction={{ label: 'Meet the Council', href: '/council' }}
        bottomContent={
          <Grid container spacing={1.5}>
            {homeFeatures.map((feature) => (
              <Grid item xs={6} lg={3} key={feature.id}>
                <FeatureCard feature={feature} compact />
              </Grid>
            ))}
          </Grid>
        }
      >
        <Typography
          component="a"
          href={siteMeta.discordUrl}
          target="_blank"
          rel="noreferrer"
          variant="body2"
          sx={{ color: 'secondary.main', fontWeight: 600, width: 'fit-content', '&:hover': { color: 'secondary.light' } }}
        >
          Join Discord →
        </Typography>
      </PageHero>
    </Box>
  );
}

export default HomePage;
