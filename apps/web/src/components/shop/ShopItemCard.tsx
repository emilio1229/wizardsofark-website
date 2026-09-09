import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import type { ShopItem } from '../../types';
import { formatEos } from '../../utils/format';
import { woaTokens } from '../../theme/tokens';

type ShopItemCardProps = {
  item: ShopItem;
  onView?: (item: ShopItem) => void;
};

export function ShopItemCard({ item, onView }: ShopItemCardProps): JSX.Element {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(item.featured
          ? {
              borderColor: 'primary.main',
              boxShadow: woaTokens.glow.magic,
            }
          : null),
      }}
    >
      <Box
        sx={{
          height: 160,
          backgroundImage: `url(${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography variant="h5">{item.name}</Typography>
          {item.featured ? <Chip size="small" label="Featured" color="primary" /> : null}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {item.description}
        </Typography>
        <Typography sx={{ mt: 2, color: 'gold.main', fontWeight: 700, fontFamily: '"Cinzel", Georgia, serif' }}>
          {formatEos(item.price)} EOS
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="outlined" fullWidth onClick={() => onView?.(item)}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}

type EOSBalanceProps = {
  balance: number;
};

export function EOSBalance({ balance }: EOSBalanceProps): JSX.Element {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.75,
        py: 1,
        borderRadius: `${woaTokens.radius.md}px`,
        border: `1px solid ${woaTokens.colours.gold.main}`,
        backgroundColor: 'rgba(214, 179, 106, 0.08)',
        boxShadow: '0 0 18px rgba(214, 179, 106, 0.18)',
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #F0D89A, #D6B36A 60%, #8f6a2c)',
        }}
      />
      <Typography sx={{ color: 'gold.light', fontWeight: 700 }}>
        {formatEos(balance)} EOS
      </Typography>
    </Box>
  );
}
