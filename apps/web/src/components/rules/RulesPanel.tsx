import { Box, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import type { RuleCategory } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { woaTokens } from '../../theme/tokens';

type RulesNavigationProps = {
  categories: RuleCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function RulesNavigation({ categories, selectedId, onSelect }: RulesNavigationProps): JSX.Element {
  return (
    <GlassPanel sx={{ p: 1.5 }}>
      <Typography variant="overline" sx={{ px: 1.5, color: 'gold.main' }}>
        Categories
      </Typography>
      <List disablePadding>
        {categories.map((category) => {
          const selected = category.id === selectedId;
          return (
            <ListItemButton
              key={category.id}
              selected={selected}
              onClick={() => onSelect(category.id)}
              sx={{
                borderRadius: `${woaTokens.radius.sm}px`,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(155, 92, 255, 0.16)',
                  boxShadow: `inset 3px 0 0 ${woaTokens.colours.primary.main}`,
                },
              }}
            >
              <ListItemText primary={category.title} />
            </ListItemButton>
          );
        })}
      </List>
    </GlassPanel>
  );
}

type RulesPanelProps = {
  category: RuleCategory;
};

export function RulesPanel({ category }: RulesPanelProps): JSX.Element {
  return (
    <GlassPanel>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {category.title} Rules
      </Typography>
      <Stack spacing={2}>
        {category.rules.map((rule, index) => (
          <Stack key={rule.id} direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                backgroundImage: woaTokens.gradients.primaryButton,
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                boxShadow: woaTokens.glow.softPurple,
              }}
            >
              {index + 1}
            </Box>
            <Typography color="text.secondary" sx={{ pt: 0.35 }}>
              {rule.text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </GlassPanel>
  );
}
