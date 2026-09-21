import { useState } from 'react';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { PageHero } from '../../components/common/PageHero';
import { GlassPanel, SectionHeader } from '../../components/common/GlassPanel';
import { MediaCard, MediaViewer } from '../../components/community/MediaGallery';
import { communityEvents } from '../../data/community';
import type { CommunityMediaItem } from '../../types';
import { woaTokens } from '../../theme/tokens';

function EventDetailPage(): JSX.Element {
  const { eventId } = useParams();
  const event = communityEvents.find((item) => item.id === eventId);
  const [selectedMedia, setSelectedMedia] = useState<CommunityMediaItem | null>(null);

  if (!event) {
    return <Navigate to="/community/events" replace />;
  }

  return (
    <>
      <PageHero
        eyebrow={`Event Record | ${event.dateLabel}`}
        title={event.title.toUpperCase()}
        subtitle={event.summary}
        description={event.description}
        backgroundImage={event.heroImage}
        minHeight={{ xs: '48vh', md: '58vh' }}
        overlay="both"
      />

      <Container
        maxWidth={false}
        sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}
      >
        <Button component={RouterLink} to="/community/events" startIcon={<ArrowBackIcon />} sx={{ mb: 4 }}>
          All Events
        </Button>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid item xs={12} md={8}>
            <SectionHeader eyebrow="Event Recap" title={event.recapTitle} />
            <Stack spacing={2.25}>
              {event.recap.map((paragraph) => (
                <Typography key={paragraph} variant="body1" color="text.secondary">
                  {paragraph}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <GlassPanel>
              <Stack spacing={1}>
                <Typography variant="overline" color="gold.main">
                  Event Date
                </Typography>
                <Typography variant="h5">{event.dateLabel}</Typography>
                {event.host ? (
                  <>
                    <Typography variant="overline" color="gold.main" sx={{ mt: 1 }}>
                      Host
                    </Typography>
                    <Typography variant="body1">{event.host}</Typography>
                  </>
                ) : null}
                {event.statusLabel ? (
                  <Typography variant="body2" color="text.muted">
                    {event.statusLabel}
                  </Typography>
                ) : null}
                <Typography variant="body2" color="text.secondary">
                  {event.media.length} captured {event.media.length === 1 ? 'moment' : 'moments'} in this event archive.
                </Typography>
              </Stack>
            </GlassPanel>
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <SectionHeader
            eyebrow="Captured During The Event"
            title="Media Archive"
            subtitle={event.media.length ? 'Select an image or video to open it.' : 'Captures from the ritual will appear here.'}
          />
          {event.media.length ? (
            <Grid container spacing={2.5}>
              {event.media.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <MediaCard item={item} onOpen={setSelectedMedia} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                py: 5,
                px: 3,
                border: `1px dashed ${woaTokens.colours.border.default}`,
                textAlign: 'center',
              }}
            >
              <Typography color="text.secondary">No event captures have been added yet.</Typography>
            </Box>
          )}
        </Box>
      </Container>

      <MediaViewer
        item={selectedMedia}
        items={event.media}
        open={selectedMedia !== null}
        onClose={() => setSelectedMedia(null)}
        onSelect={setSelectedMedia}
      />
    </>
  );
}

export default EventDetailPage;