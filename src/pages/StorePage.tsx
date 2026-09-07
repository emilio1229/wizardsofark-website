import StorefrontIcon from '@mui/icons-material/Storefront';
import { Chip, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import PageHero from '../components/PageHero';
import SectionCard from '../components/SectionCard';
import { siteMeta, storeContent } from '../data/siteContent';

function StorePage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Realm Shop"
        title="Purchases stay inside Discord tickets so every order is traceable and fair."
        description="The store flow is intentionally simple: open a ticket, state the order clearly, and let staff process it inside a single logged thread."
        primaryAction={{ label: 'Make a Purchase on Discord', href: siteMeta.discordUrl, external: true }}
        secondaryAction={{ label: 'Need Support?', href: '/contact' }}
      />

      <Container maxWidth="lg" sx={{ mt: -7, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SectionCard>
              <Typography variant="sectionTitle" gutterBottom>
                How to Make a Purchase
              </Typography>
              <Stepper orientation="vertical" activeStep={storeContent.steps.length} nonLinear>
                {storeContent.steps.map((step) => (
                  <Step key={step.title} expanded>
                    <StepLabel>{step.title}</StepLabel>
                    <StepContent>
                      <Typography color="text.secondary">{step.description}</Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </SectionCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <SectionCard sx={{ height: '100%' }}>
              <Typography variant="sectionTitle" gutterBottom>
                Important Notes
              </Typography>
              <List disablePadding>
                {storeContent.notes.map((note) => (
                  <ListItem key={note} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
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
            </SectionCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default StorePage;