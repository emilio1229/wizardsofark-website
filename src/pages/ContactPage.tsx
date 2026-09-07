import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Button, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import PageHero from '../components/PageHero';
import SectionCard from '../components/SectionCard';
import { contactContent, siteMeta } from '../data/siteContent';

function ContactPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Contact and Support"
        title="Support runs through Discord tickets only so enforcement and appeals stay auditable."
        description="This flow keeps staff actions logged, protects players from informal handling, and gives every issue a single thread for evidence and follow-up."
        primaryAction={{ label: 'Open a Ticket on Discord', href: siteMeta.discordUrl, external: true }}
        secondaryAction={{ label: 'View Store Flow', href: '/store' }}
      />

      <Container maxWidth="lg" sx={{ mt: -7, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <SectionCard>
              <Typography variant="sectionTitle" gutterBottom>
                How to Open a Ticket
              </Typography>
              <List disablePadding>
                {contactContent.steps.map((step) => (
                  <ListItem key={step} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SupportAgentIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={step} primaryTypographyProps={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </SectionCard>
          </Grid>
          <Grid item xs={12} md={5}>
            <SectionCard sx={{ height: '100%' }}>
              <Typography variant="sectionTitle" gutterBottom>
                What to Include
              </Typography>
              <List disablePadding>
                {contactContent.checklist.map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SupportAgentIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} primaryTypographyProps={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Typography color="text.secondary">
                  Do not DM admins or owners for enforcement. Ticket-based support is the official path for rule clarifications, appeals, shop problems, and post-restart incidents.
                </Typography>
                <Button variant="contained" color="primary" href={siteMeta.discordUrl} target="_blank" rel="noreferrer">
                  Message via Discord Ticket
                </Button>
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ContactPage;