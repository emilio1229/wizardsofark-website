import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CottageIcon from '@mui/icons-material/Cottage';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DnsIcon from '@mui/icons-material/Dns';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupsIcon from '@mui/icons-material/Groups';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import type { CommunityActivity, CommunityCategory, FeatureCardData } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { woaTokens } from '../../theme/tokens';

const iconMap: Record<string, typeof EventIcon> = {
  event: EventIcon,
  menu_book: MenuBookIcon,
  cottage: CottageIcon,
  photo_library: PhotoLibraryIcon,
  dns: DnsIcon,
  auto_awesome: AutoAwesomeIcon,
  groups: GroupsIcon,
  storefront: StorefrontIcon,
};

type FeatureCardProps = {
  feature: FeatureCardData;
  compact?: boolean;
};

export function FeatureCard({ feature, compact = false }: FeatureCardProps): JSX.Element {
  const Icon = iconMap[feature.icon] || AutoAwesomeIcon;

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea component={RouterLink} to={feature.to} sx={{ height: '100%' }}>
        <CardContent sx={{ p: compact ? 2 : 3 }}>
          <Box
            sx={{
              width: compact ? 40 : 48,
              height: compact ? 40 : 48,
              borderRadius: `${woaTokens.radius.sm}px`,
              display: 'grid',
              placeItems: 'center',
              mb: compact ? 1.25 : 2,
              background: woaTokens.gradients.cardHover,
              border: `1px solid ${woaTokens.colours.border.default}`,
              color: 'primary.light',
              boxShadow: woaTokens.glow.softPurple,
            }}
          >
            <Icon fontSize={compact ? 'small' : 'medium'} />
          </Box>
          <Typography variant={compact ? 'h6' : 'h5'} gutterBottom={!compact} sx={compact ? { mb: 0.75 } : undefined}>
            {feature.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: compact ? 1 : 2,
              ...(compact
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
                : null),
            }}
          >
            {feature.description}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: 'primary.light' }}>
            <Typography variant="body2" fontWeight={600}>
              Explore
            </Typography>
            <ArrowForwardIcon fontSize="small" />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

type CommunityCardProps = {
  category: CommunityCategory;
};

export function CommunityCard({ category }: CommunityCardProps): JSX.Element {
  const Icon = iconMap[category.icon] || EventIcon;

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea component={RouterLink} to={category.to} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Icon sx={{ color: 'primary.light', mb: 1.5, fontSize: 36 }} />
          <Typography variant="h5" gutterBottom>
            {category.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

type ActivityListProps = {
  items: CommunityActivity[];
};

export function ActivityList({ items }: ActivityListProps): JSX.Element {
  return (
    <GlassPanel>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Latest Activity
      </Typography>
      <Stack spacing={2}>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1.5}
            sx={{
              pb: 2,
              borderBottom: `1px solid ${woaTokens.colours.border.default}`,
              '&:last-child': { borderBottom: 'none', pb: 0 },
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'gold.main', textTransform: 'uppercase' }}>
                {item.type}
              </Typography>
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.summary}
              </Typography>
            </Box>
            <Button component={RouterLink} to={item.to} variant="outlined" size="small">
              {item.actionLabel}
            </Button>
          </Stack>
        ))}
      </Stack>
    </GlassPanel>
  );
}
