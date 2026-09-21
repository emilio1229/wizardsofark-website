import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import { PageHero } from '../../components/common/PageHero';
import { SectionHeader } from '../../components/common/GlassPanel';
import { communityEvents } from '../../data/community';
import { woaTokens } from '../../theme/tokens';

function EventsPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Community Archive"
        title="EVENTS"
        subtitle="Shared stories from across the realm."
        description="Explore the events that brought the community together, then open each record for its recap and captured moments."
        backgroundImage="/assets/branding/eventBackImage.png"
        minHeight={{ xs: '40vh', md: '46vh' }}
        overlay="vertical"
      />

      <Container
        maxWidth={false}
        sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}
      >
        <Button component={RouterLink} to="/community" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
          Back to Community
        </Button>

        <SectionHeader
          eyebrow="Event Archive"
          title="Recent Events"
          subtitle="Select an event to read the full account and view its captured media."
        />

        <Grid container spacing={3}>
          {communityEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card sx={{ height: '100%', overflow: 'hidden' }}>
                <CardActionArea component={RouterLink} to={`/community/events/${event.id}`} sx={{ height: '100%', alignItems: 'stretch' }}>
                  <Box
                    sx={{
                      height: 220,
                      position: 'relative',
                      backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(5,8,17,0.94)), url(${event.heroImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minHeight: 200 }}>
                    <Typography variant="overline" color="gold.main">
                      {event.dateLabel}
                    </Typography>
                    <Typography variant="h5">{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {event.summary}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.75} color="primary.light">
                      <Typography variant="button">Open event</Typography>
                      <ArrowForwardIcon fontSize="small" />
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default EventsPage;