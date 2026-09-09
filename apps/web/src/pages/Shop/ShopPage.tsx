import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link as RouterLink } from 'react-router-dom';
import { features } from '../../config/features';
import { ticketShopContent } from '../../data/shop';
import { siteMeta } from '../../data/site';
import { PageHero } from '../../components/common/PageHero';
import { GlassPanel, SectionHeader } from '../../components/common/GlassPanel';
import { EOSBalance, ShopItemCard } from '../../components/shop/ShopItemCard';
import { useEosBalance, useShopItems } from '../../hooks/useApi';
import type { ShopCategory, ShopItem } from '../../types';
import { formatEos } from '../../utils/format';
import { woaTokens } from '../../theme/tokens';

const categories: Array<{ id: ShopCategory | 'featured'; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'structures', label: 'Structures' },
  { id: 'skins', label: 'Skins' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'creatures', label: 'Creatures' },
  { id: 'decor', label: 'Decor' },
];

function TicketShopPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Realm Shop"
        title="SHOP"
        subtitle="Purchases stay inside Discord tickets"
        description="Open a ticket, state the order clearly, and let staff process it in a single logged thread."
        primaryAction={{ label: 'Make a Purchase on Discord', href: siteMeta.discordUrl, external: true }}
        secondaryAction={{ label: 'Need Support?', href: '/community' }}
        compact
      />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: woaTokens.layout.contentMaxWidth,
          px: { xs: 2, md: 4 },
          py: { xs: 5, md: 7 },
        }}
      >
        <Grid container spacing={2.5} justifyContent="center">
          <Grid item xs={12} md={7} lg={6}>
            <GlassPanel>
              <Typography variant="sectionTitle" gutterBottom>
                How to Make a Purchase
              </Typography>
              <Stepper orientation="vertical" activeStep={ticketShopContent.steps.length} nonLinear>
                {ticketShopContent.steps.map((step) => (
                  <Step key={step.title} expanded>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontFamily: '"Cinzel", Georgia, serif',
                          fontWeight: 600,
                          color: 'text.primary',
                        },
                      }}
                    >
                      {step.title}
                    </StepLabel>
                    <StepContent>
                      <Typography color="text.secondary">{step.description}</Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </GlassPanel>
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <GlassPanel sx={{ height: '100%' }}>
              <Typography variant="sectionTitle" gutterBottom>
                Important Notes
              </Typography>
              <List disablePadding>
                {ticketShopContent.notes.map((note) => (
                  <ListItem key={note} disableGutters alignItems="flex-start">
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                      <StorefrontIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={note} primaryTypographyProps={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 3 }}>
                <Chip label="Tickets only" color="primary" />
                <Chip label="Logged orders" color="primary" variant="outlined" />
                <Chip label="Staff confirmed" color="primary" variant="outlined" />
              </Stack>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  href={siteMeta.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  fullWidth
                  sx={{ boxShadow: woaTokens.glow.softPurple }}
                >
                  Open Discord
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/community"
                  fullWidth
                  sx={{ mt: 1.5 }}
                >
                  Community Support
                </Button>
              </Box>
            </GlassPanel>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function EosShopPage(): JSX.Element {
  const { data: itemsResult, isError: itemsError } = useShopItems();
  const { data: balanceResult } = useEosBalance();
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<ShopItem | null>(null);

  const items = itemsResult?.status === 'success' ? itemsResult.data : [];
  const balance = balanceResult?.status === 'success' ? balanceResult.data : 0;
  const activeCategory = categories[tab]?.id || 'featured';

  const filtered = useMemo(() => {
    if (activeCategory === 'featured') {
      return items.filter((item) => item.featured);
    }
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <Container
      maxWidth={false}
      sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }}
    >
      <SectionHeader
        title="SHOP"
        subtitle="Use your EOS points to unlock exclusive rewards."
        action={<EOSBalance balance={balance} />}
      />

      {itemsError || itemsResult?.status === 'error' ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Shop catalogue is temporarily unavailable.
        </Alert>
      ) : null}

      <Tabs
        value={tab}
        onChange={(_, value: number) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: `1px solid ${woaTokens.colours.border.default}` }}
      >
        {categories.map((category) => (
          <Tab key={category.id} label={category.label} />
        ))}
      </Tabs>

      <Grid container spacing={2.5}>
        {filtered.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <ShopItemCard item={item} onView={setSelected} />
          </Grid>
        ))}
        {filtered.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary">No items in this category yet.</Typography>
          </Grid>
        ) : null}
      </Grid>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        {selected ? (
          <>
            <DialogTitle>{selected.name}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ pb: 1 }}>
                <Typography color="text.secondary">{selected.description}</Typography>
                <Typography sx={{ color: 'gold.main', fontWeight: 700 }}>
                  {formatEos(selected.price)} EOS
                </Typography>
                <Typography variant="body2" color="text.muted">
                  Purchases will connect to the EOS wallet service in a future release.
                </Typography>
              </Stack>
            </DialogContent>
          </>
        ) : null}
      </Dialog>
    </Container>
  );
}

function ShopPage(): JSX.Element {
  return features.eosShop ? <EosShopPage /> : <TicketShopPage />;
}

export default ShopPage;
