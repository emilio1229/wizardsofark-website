import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Chip, Container, Grid, List, ListItem, Stack, Typography } from '@mui/material';
import PageHero from '../components/PageHero';
import SectionCard from '../components/SectionCard';
import { serverInfoContent, siteMeta } from '../data/siteContent';

function ServerInfoPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Rules and Settings"
        title="Operational rules, balance choices, and cluster configuration in one place."
        description="Every major policy, rate, cap, and quality-of-life setting is organized below so players can find the authoritative version quickly."
        primaryAction={{ label: 'Check Discord Updates', href: siteMeta.discordUrl, external: true }}
        secondaryAction={{ label: 'Open Store', href: '/store' }}
      />

      <Container maxWidth="lg" sx={{ mt: -7, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SectionCard>
              <Typography variant="sectionTitle" gutterBottom>
                At a Glance
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {serverInfoContent.quickStats.map((item) => (
                  <Chip key={item} label={item} color="primary" variant="outlined" />
                ))}
              </Stack>
            </SectionCard>
          </Grid>
          <Grid item xs={12}>
            <SectionCard>
              <Typography variant="sectionTitle" gutterBottom>
                Full Server Rules and Settings
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Expand any section for the detailed guidance currently governing building, breeding, trading, transfers, performance, and admin enforcement.
              </Typography>
              <Stack spacing={2}>
                {serverInfoContent.accordions.map((panel) => (
                  <Accordion key={panel.title} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                      <Typography variant="h6">{panel.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        {panel.sections.map((section, index) => (
                          <Stack spacing={1} key={`${panel.title}-${index}`}>
                            {section.heading ? <Typography variant="subtitle1">{section.heading}</Typography> : null}
                            {section.body ? <Typography color="text.secondary">{section.body}</Typography> : null}
                            {section.items ? (
                              <List dense sx={{ py: 0 }}>
                                {section.items.map((item) => (
                                  <ListItem key={item} sx={{ display: 'list-item', py: 0.25, color: 'text.secondary' }}>
                                    {item}
                                  </ListItem>
                                ))}
                              </List>
                            ) : null}
                          </Stack>
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ServerInfoPage;