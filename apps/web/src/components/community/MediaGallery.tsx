import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import type { CommunityMediaItem } from '../../types';
import { woaTokens } from '../../theme/tokens';

type MediaCardProps = {
  item: CommunityMediaItem;
  onOpen: (item: CommunityMediaItem) => void;
};

function getYouTubeEmbedUrl(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);
    const hostname = url.hostname.replace(/^www\./, '');
    let videoId: string | undefined;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0];
    } else if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      const pathParts = url.pathname.split('/').filter(Boolean);
      videoId = url.searchParams.get('v') ?? (pathParts[0] === 'embed' || pathParts[0] === 'shorts' ? pathParts[1] : undefined);
    }

    if (!videoId) {
      return null;
    }

    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
    const start = url.searchParams.get('start') ?? url.searchParams.get('t');
    if (start) {
      const seconds = start.match(/\d+/)?.[0];
      if (seconds) {
        embedUrl.searchParams.set('start', seconds);
      }
    }

    return embedUrl.toString();
  } catch {
    return null;
  }
}

export function MediaCard({ item, onOpen }: MediaCardProps): JSX.Element {
  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardActionArea onClick={() => onOpen(item)} sx={{ height: '100%', alignItems: 'stretch' }}>
        <Box
          sx={{
            position: 'relative',
            height: 180,
            backgroundImage: `url(${item.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'background.elevated',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(5,8,17,0.9) 100%)',
            }}
          />
          <Chip
            size="small"
            icon={item.kind === 'video' ? <PlayCircleOutlineIcon /> : <ImageOutlinedIcon />}
            label={item.kind === 'video' ? 'Video' : 'Image'}
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'rgba(5,8,17,0.72)',
              border: `1px solid ${woaTokens.colours.border.default}`,
              color: 'text.primary',
              '& .MuiChip-icon': { color: item.kind === 'video' ? 'secondary.main' : 'primary.light' },
            }}
          />
          {item.kind === 'video' ? (
            <PlayCircleOutlineIcon
              sx={{
                position: 'absolute',
                left: '50%',
                top: '45%',
                transform: 'translate(-50%, -50%)',
                fontSize: 56,
                color: 'rgba(255,255,255,0.9)',
                filter: `drop-shadow(0 0 12px ${woaTokens.colours.primary.main})`,
              }}
            />
          ) : null}
        </Box>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
            {item.description}
          </Typography>
          {item.tags?.length ? (
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {item.tags.map((tag) => (
                <Chip key={tag} size="small" label={tag} variant="outlined" />
              ))}
            </Stack>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

type MediaViewerProps = {
  item: CommunityMediaItem | null;
  items: CommunityMediaItem[];
  open: boolean;
  onClose: () => void;
  onSelect: (item: CommunityMediaItem) => void;
};

export function MediaViewer({ item, items, open, onClose, onSelect }: MediaViewerProps): JSX.Element {
  const youtubeEmbedUrl = item?.videoUrl ? getYouTubeEmbedUrl(item.videoUrl) : null;
  const isExternalVideo = item?.kind === 'video' && !!youtubeEmbedUrl;
  const itemIndex = item ? items.findIndex((candidate) => candidate.id === item.id) : -1;
  const previousItem = itemIndex > 0 ? items[itemIndex - 1] : undefined;
  const nextItem = itemIndex >= 0 && itemIndex < items.length - 1 ? items[itemIndex + 1] : undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ position: 'relative', p: { xs: 1.5, md: 2.5 } }}>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
        >
          <Tooltip title="Previous media">
            <span>
              <IconButton
                aria-label="Previous media"
                onClick={() => previousItem && onSelect(previousItem)}
                disabled={!previousItem}
                sx={{ bgcolor: 'rgba(5,8,17,0.7)' }}
              >
                <ChevronLeftIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Next media">
            <span>
              <IconButton
                aria-label="Next media"
                onClick={() => nextItem && onSelect(nextItem)}
                disabled={!nextItem}
                sx={{ bgcolor: 'rgba(5,8,17,0.7)' }}
              >
                <ChevronRightIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Close media viewer">
            <IconButton aria-label="Close media viewer" onClick={onClose} sx={{ bgcolor: 'rgba(5,8,17,0.7)' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        {item ? (
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ pr: 18 }}>
                <Typography variant="overline" sx={{ color: 'gold.main' }}>
                  {item.kind === 'video' ? 'Video' : 'Image'}
                </Typography>
                {itemIndex >= 0 ? (
                  <Typography variant="caption" color="text.muted">
                    {itemIndex + 1} of {items.length}
                  </Typography>
                ) : null}
              </Stack>
              <Typography variant="h4">{item.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {item.description}
              </Typography>
            </Box>

            {item.kind === 'video' && item.videoUrl ? (
              isExternalVideo ? (
                <Box
                  sx={{
                    position: 'relative',
                    pt: '56.25%',
                    borderRadius: `${woaTokens.radius.md}px`,
                    overflow: 'hidden',
                    border: `1px solid ${woaTokens.colours.border.default}`,
                    bgcolor: '#000',
                  }}
                >
                  <Box
                    component="iframe"
                    src={youtubeEmbedUrl ?? undefined}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    borderRadius: `${woaTokens.radius.md}px`,
                    border: `1px solid ${woaTokens.colours.border.default}`,
                    bgcolor: '#000',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="video"
                    src={item.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    sx={{
                      display: 'block',
                      width: '100%',
                      maxHeight: '75vh',
                      background: '#000',
                    }}
                  />
                </Box>
              )
            ) : item.kind === 'video' ? (
              <Box
                sx={{
                  borderRadius: `${woaTokens.radius.md}px`,
                  border: `1px solid ${woaTokens.colours.border.default}`,
                  bgcolor: 'background.elevated',
                  p: 4,
                  textAlign: 'center',
                  backgroundImage: `linear-gradient(180deg, rgba(5,8,17,0.55), rgba(5,8,17,0.92)), url(${item.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: 280,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Typography color="text.secondary">
                  Upload a video or add a YouTube embed URL.
                </Typography>
              </Box>
            ) : (
              <Box
                component="img"
                src={item.src || item.thumbnail}
                alt={item.title}
                sx={{
                  width: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: `${woaTokens.radius.md}px`,
                  border: `1px solid ${woaTokens.colours.border.default}`,
                  bgcolor: 'background.elevated',
                }}
              />
            )}

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {item.credit ? (
                <Typography variant="caption" color="text.muted">
                  Credit: {item.credit}
                </Typography>
              ) : null}
              {item.createdAt ? (
                <Typography variant="caption" color="text.muted">
                  {item.createdAt}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
