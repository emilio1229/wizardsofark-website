import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import { PageHero } from '../../components/common/PageHero';
import { MediaCard, MediaViewer } from '../../components/community/MediaGallery';
import { SectionHeader } from '../../components/common/GlassPanel';
import { useCommunityMedia } from '../../hooks/useApi';
import type { CommunityMediaItem, MediaKind } from '../../types';
import { woaTokens } from '../../theme/tokens';

type FilterTab = 'all' | MediaKind;

const filters: Array<{ id: FilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
];

function MediaPage(): JSX.Element {
  const { data, isLoading, isError } = useCommunityMedia();
  const items = data?.status === 'success' ? data.data : [];
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<CommunityMediaItem | null>(null);

  const activeFilter = filters[tab]?.id ?? 'all';

  const filtered = useMemo(() => {
    if (activeFilter === 'all') {
      return items;
    }
    return items.filter((item) => item.kind === activeFilter);
  }, [items, activeFilter]);

  const imageCount = items.filter((item) => item.kind === 'image').length;
  const videoCount = items.filter((item) => item.kind === 'video').length;

  return (
    <>
      <PageHero
        title="MEDIA"
        subtitle="Screenshots, clips, and stories from the realm."
        description="Browse community captures and featured videos from across the Wizards of Ark cluster."
        backgroundImage="/assets/gallery/gallery8.png"
        minHeight={{ xs: '36vh', md: '42vh' }}
        overlay="vertical"
      />

      <Container
        maxWidth={false}
        sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
          <Button component={RouterLink} to="/community" startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>
            Back to Community
          </Button>
          <Typography variant="body2" color="text.muted">
            {imageCount} images · {videoCount} videos
          </Typography>
        </Stack>

        <SectionHeader
          title="Community Media"
          subtitle="Select an item to open the viewer. Add new files under public/assets/community/media/."
        />

        {isError || data?.status === 'error' ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Media library is temporarily unavailable.
          </Alert>
        ) : null}

        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          sx={{ mb: 3, borderBottom: `1px solid ${woaTokens.colours.border.default}` }}
        >
          {filters.map((filter) => (
            <Tab key={filter.id} label={filter.label} />
          ))}
        </Tabs>

        <Grid container spacing={2.5}>
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                  <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
                </Grid>
              ))
            : null}

          {!isLoading && filtered.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No media items in this filter yet.</Typography>
              </Box>
            </Grid>
          ) : null}

          {filtered.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <MediaCard item={item} onOpen={setSelected} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <MediaViewer item={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
}

export default MediaPage;
