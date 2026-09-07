import { useState } from 'react';
import {
  Box,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { GalleryItem } from '../data/siteContent';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import FlareIcon from '@mui/icons-material/Flare';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SectionCard from '../components/SectionCard';
import { homeContent, siteMeta } from '../data/siteContent';

const spotlightImages = [homeContent.gallery[8], homeContent.gallery[4], homeContent.gallery[10], homeContent.gallery[2]];

function HomePage(): JSX.Element {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryImages = homeContent.gallery;
  const selectedImage = selectedImageIndex === null ? null : galleryImages[selectedImageIndex];

  const openCarouselAtImage = (image: GalleryItem) => {
    const imageIndex = galleryImages.findIndex((galleryImage) => galleryImage.src === image.src);

    if (imageIndex >= 0) {
      setSelectedImageIndex(imageIndex);
    }
  };

  const closeCarousel = () => {
    setSelectedImageIndex(null);
  };

  const showPreviousImage = () => {
    if (selectedImageIndex === null) {
      return;
    }

    setSelectedImageIndex((selectedImageIndex + galleryImages.length - 1) % galleryImages.length);
  };

  const showNextImage = () => {
    if (selectedImageIndex === null) {
      return;
    }

    setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pb: 8,
          backgroundImage: {
            xs: 'linear-gradient(180deg, rgba(33, 22, 58, 0.48), rgba(33, 22, 58, 0.62)), url(/assets/header-hero-mobile.jpg)',
            md: 'linear-gradient(90deg, rgba(33, 22, 58, 0.7) 0%, rgba(33, 22, 58, 0.5) 34%, rgba(33, 22, 58, 0.22) 58%, rgba(33, 22, 58, 0.5) 100%), url(/assets/header-hero.jpg)',
          },
          backgroundPosition: { xs: 'center top', md: 'center top' },
          backgroundSize: 'cover',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 18% 24%, rgba(201, 168, 106, 0.16), transparent 20%), radial-gradient(circle at 78% 18%, rgba(201, 168, 106, 0.16), transparent 15%), radial-gradient(circle at 88% 16%, rgba(44, 33, 65, 0.12), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', pt: { xs: 4, md: 6 }, pb: { xs: 4, md: 8 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} lg={5}>
              <Stack spacing={3.5}>
                <Typography variant="overline" sx={{ letterSpacing: 5.5, color: 'secondary.light' }}>
                  Home of the Realm
                </Typography>
                <Typography variant="heroTitle" sx={{ maxWidth: 620, color: 'secondary.main', textShadow: '0 10px 24px rgba(23, 15, 38, 0.34)' }}>
                  A PvE cluster with editorial energy, clean progression, and a world worth staying in.
                </Typography>
                <Typography variant="h6" sx={{ maxWidth: 540, lineHeight: 1.7, fontWeight: 400, color: 'rgba(240, 226, 187, 0.9)' }}>
                  The Wizards of Ark brings together all official maps, active staff coverage, regular events, and a fantasy-forward community identity in a sharper, more curated landing experience.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75}>
                  <Chip label="All official maps" color="primary" sx={{ px: 1, py: 2.8, fontSize: '0.95rem', color: 'secondary.main', bgcolor: 'rgba(44, 33, 65, 0.92)' }} />
                  <Chip label="PvE community" variant="outlined" sx={{ px: 1, py: 2.8, fontSize: '0.95rem', color: 'secondary.light', borderColor: 'rgba(201, 168, 106, 0.34)', bgcolor: 'rgba(44, 33, 65, 0.18)' }} />
                  <Chip label="Events and giveaways" variant="outlined" sx={{ px: 1, py: 2.8, fontSize: '0.95rem', color: 'secondary.light', borderColor: 'rgba(201, 168, 106, 0.34)', bgcolor: 'rgba(44, 33, 65, 0.18)' }} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75}>
                  <SectionLink href={siteMeta.discordUrl} external label="Enter the Realm" />
                  <SectionLink href="/server-info" label="Read Server Info" secondary />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={7}>
              <Box sx={{ position: 'relative', minHeight: { xs: 420, md: 720 } }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: { xs: 0, md: '4% 13% 6% 12%' },
                    borderRadius: '38% 38% 20% 20% / 26% 26% 12% 12%',
                    overflow: 'hidden',
                    border: '1px solid rgba(23,21,18,0.1)',
                    boxShadow: '0 40px 90px rgba(17, 15, 11, 0.18)',
                    backgroundColor: 'rgba(23, 15, 38, 0.44)',
                    background: 'linear-gradient(145deg, rgba(23, 15, 38, 0.56), rgba(23, 15, 38, 0.36))',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at 50% 50%, rgba(201, 168, 106, 0.12), transparent 18%), radial-gradient(circle at 72% 42%, rgba(111, 86, 161, 0.18), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
                    }}
                  />
                  <Box
                    component="img"
                    src="/assets/logo.png"
                    alt="The Wizards of Ark crest"
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: '62%', sm: '58%', md: '68%' },
                      maxWidth: 420,
                      maxHeight: '72%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 28px 32px rgba(0, 0, 0, 0.42))',
                    }}
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: { xs: 12, md: 10 }, left: { xs: 12, md: '20%' }, px: 2.2, py: 1.4, borderRadius: 999, bgcolor: 'rgba(44, 33, 65, 0.72)', border: '1px solid rgba(201, 168, 106, 0.18)' }}>
                  <Typography variant="caption" sx={{ letterSpacing: 2.4, textTransform: 'uppercase', color: 'secondary.light' }}>
                    Arcane Cluster Hub
                  </Typography>
                </Box>
                <SectionCard sx={{ position: 'absolute', left: 0, bottom: { xs: 18, md: 48 }, width: { xs: 210, md: 230 }, p: 2.5, bgcolor: 'rgba(251,248,240,0.9)' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 2.4, color: 'text.secondary' }}>
                    Next priority
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, mb: 1 }}>
                    Join the Discord and unlock the realm.
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                    Rules first, then full server access, support, and events.
                  </Typography>
                </SectionCard>
                <SectionCard sx={{ position: 'absolute', right: { xs: 0, md: 12 }, bottom: { xs: -18, md: 68 }, width: { xs: 180, md: 220 }, p: 2.4, bgcolor: '#171512', color: '#f6f2e9' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 2.4, color: 'rgba(255,255,255,0.62)' }}>
                    Community pulse
                  </Typography>
                  <Typography variant="sectionTitle" sx={{ fontSize: '2.5rem', lineHeight: 0.95, mt: 1, mb: 0.8, color: 'secondary.main' }}>
                    PvE
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.78)' }}>
                    Built for long-term progression, events, and cross-map play.
                  </Typography>
                </SectionCard>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pb: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <SectionCard sx={{ height: '100%', minHeight: 360 }}>
              <Stack spacing={2}>
                <Typography variant="sectionTitle">Welcome to the Wizards of Ark</Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  Step into a living realm built around exploration, community, and balanced progression. The cluster is tuned to remove pointless grind while keeping the game’s challenge, economy, and sense of scale intact.
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  Whether you want to tame legendary creatures, build across the map network, participate in events, or settle into a long-term PvE home, the cluster is structured to support that loop.
                </Typography>
                <SectionLink href="/council" label="Meet the Council" inline />
              </Stack>
            </SectionCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <SectionCard sx={{ height: '100%', minHeight: 360, bgcolor: '#171512', color: '#f6f2e9' }}>
                  <Typography variant="sectionTitle" sx={{ color: '#f6f2e9', mb: 2.5 }}>
                    Join the Adventure
                  </Typography>
                  <List disablePadding>
                    {homeContent.joinSteps.map((step) => (
                      <ListItem key={step} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <TravelExploreIcon sx={{ color: 'secondary.main' }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={step} primaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }} />
                      </ListItem>
                    ))}
                  </List>
                </SectionCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <SectionCard sx={{ height: '100%', minHeight: 360 }}>
                  <Typography variant="sectionTitle" sx={{ mb: 1.5 }}>
                    If the server list is empty
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    Refreshes and filters matter. Use the steps below before opening a support ticket.
                  </Typography>
                  <List disablePadding>
                    {homeContent.filterTips.map((tip) => (
                      <ListItem key={tip} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ArrowForwardIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={tip} primaryTypographyProps={{ color: 'text.secondary' }} />
                      </ListItem>
                    ))}
                  </List>
                </SectionCard>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <SectionCard sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} md={4}>
                  <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="overline" sx={{ letterSpacing: 4.5, color: 'text.secondary' }}>
                        Realm Access
                      </Typography>
                      <Typography variant="sectionTitle" sx={{ mt: 1.2 }}>
                        Unlock the server the right way.
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      Discord access is staged. Read the rules first, then complete the entry action to open the rest of the server and support channels.
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    {homeContent.unlockSteps.map((step, index) => (
                      <Grid item xs={12} md={4} key={step}>
                        <Box sx={{ height: '100%', p: 2.8, borderRadius: '24px', background: index === 1 ? '#171512' : 'rgba(23,21,18,0.04)', color: index === 1 ? '#f6f2e9' : 'text.primary', border: '1px solid rgba(23,21,18,0.08)' }}>
                          <Typography variant="overline" sx={{ color: index === 1 ? 'secondary.main' : 'text.secondary', letterSpacing: 3.2 }}>
                            Step {index + 1}
                          </Typography>
                          <Typography variant="h5" sx={{ mt: 1.2, lineHeight: 1.15 }}>
                            {step}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <SectionCard sx={{ height: '100%' }}>
                  <Typography variant="overline" sx={{ letterSpacing: 4.2, color: 'text.secondary' }}>
                    Why the realm works
                  </Typography>
                  <Typography variant="sectionTitle" sx={{ mt: 1.2, mb: 2 }}>
                    Balanced systems, visible staff, and a community loop that stays active.
                  </Typography>
                  <Grid container spacing={1.5}>
                    {homeContent.highlights.map((item) => (
                      <Grid item xs={12} sm={6} key={item}>
                        <Stack direction="row" spacing={1.25} alignItems="flex-start">
                          <AutoAwesomeIcon color="secondary" sx={{ mt: 0.2 }} />
                          <Typography color="text.secondary">{item}</Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </SectionCard>
              </Grid>
              <Grid item xs={12} md={7}>
                <Grid container spacing={2.2}>
                  {spotlightImages.map((image, index) => (
                    <Grid item xs={12} sm={index === 0 ? 12 : 6} key={image.src}>
                      <Box
                        onClick={() => openCarouselAtImage(image)}
                        sx={{
                          cursor: 'pointer',
                          overflow: 'hidden',
                          borderRadius: index === 0 ? '32px' : '26px',
                          position: 'relative',
                          minHeight: index === 0 ? 320 : 220,
                          boxShadow: '0 18px 42px rgba(20, 18, 14, 0.1)',
                        }}
                      >
                        <Box
                          component="img"
                          src={image.src}
                          alt={image.alt}
                          sx={{ width: '100%', height: index === 0 ? 320 : 220, objectFit: 'cover', transition: 'transform 220ms ease', '&:hover': { transform: 'scale(1.04)' } }}
                        />
                        <Box sx={{ position: 'absolute', insetInline: 0, bottom: 0, p: 2.2, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.68))' }}>
                          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                            {image.caption}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <SectionCard sx={{ bgcolor: '#171512', color: '#f6f2e9', overflow: 'hidden' }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.65)', letterSpacing: 4.5 }}>
                    Arcane Gallery
                  </Typography>
                  <Typography variant="sectionTitle" sx={{ color: '#f6f2e9', mt: 1.25, mb: 1.5 }}>
                    A curated look at the builds, events, and landmarks defining the cluster.
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.74)', lineHeight: 1.7 }}>
                    The gallery is no longer just a pile of thumbnails. It now reads like a featured archive, with stronger emphasis on scene, scale, and identity.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={1.5}>
                    {homeContent.gallery.slice(0, 6).map((image, index) => (
                      <Grid item xs={6} md={index === 0 ? 6 : 3} key={image.src}>
                        <Box
                          onClick={() => openCarouselAtImage(image)}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '22px',
                            overflow: 'hidden',
                            height: index === 0 ? 280 : 134,
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <Box component="img" src={image.src} alt={image.alt} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={Boolean(selectedImage)} onClose={closeCarousel} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: 'background.default' }}>
          {selectedImage ? (
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 3.2 }}>
                    Arcane Gallery
                  </Typography>
                  <Typography variant="h5">{selectedImage.caption}</Typography>
                </Box>
                <IconButton onClick={closeCarousel} aria-label="Close gallery carousel">
                  <CloseIcon />
                </IconButton>
              </Stack>

              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  sx={{ width: '100%', display: 'block', borderRadius: 3, maxHeight: '72vh', objectFit: 'cover' }}
                />
                <IconButton
                  onClick={showPreviousImage}
                  aria-label="Previous gallery image"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: { xs: 8, md: 16 },
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(251,248,240,0.88)',
                    border: '1px solid rgba(23,21,18,0.08)',
                    '&:hover': { bgcolor: 'rgba(251,248,240,1)' },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={showNextImage}
                  aria-label="Next gallery image"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: { xs: 8, md: 16 },
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(251,248,240,0.88)',
                    border: '1px solid rgba(23,21,18,0.08)',
                    '&:hover': { bgcolor: 'rgba(251,248,240,1)' },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>

              <Stack direction="row" spacing={1.25} sx={{ overflowX: 'auto', pb: 0.5 }}>
                {galleryImages.map((image, index) => {
                  const isActive = index === selectedImageIndex;

                  return (
                    <Box
                      key={image.src}
                      component="button"
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      sx={{
                        border: isActive ? '2px solid' : '1px solid',
                        borderColor: isActive ? 'primary.main' : 'rgba(23,21,18,0.12)',
                        borderRadius: 2.5,
                        overflow: 'hidden',
                        p: 0,
                        minWidth: 108,
                        height: 74,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        opacity: isActive ? 1 : 0.72,
                        transition: 'opacity 160ms ease, transform 160ms ease',
                        '&:hover': { opacity: 1, transform: 'translateY(-2px)' },
                      }}
                    >
                      <Box component="img" src={image.src} alt={image.alt} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

type SectionLinkProps = {
  href: string;
  label: string;
  external?: boolean;
  secondary?: boolean;
  inline?: boolean;
};

function SectionLink({ href, label, external, secondary, inline }: SectionLinkProps): JSX.Element {
  return (
    <Box
      component="a"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      sx={{
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        gap: 1,
        width: inline ? 'fit-content' : undefined,
        px: inline ? 0 : 2.2,
        py: inline ? 0 : 1.6,
        borderRadius: inline ? 0 : 999,
        border: inline ? 'none' : `1px solid ${secondary ? 'rgba(201, 168, 106, 0.34)' : 'transparent'}`,
        bgcolor: inline ? 'transparent' : secondary ? 'rgba(44, 33, 65, 0.22)' : 'primary.main',
        color: secondary ? 'secondary.light' : inline ? 'secondary.main' : 'secondary.light',
        fontWeight: 700,
      }}
    >
      {label}
      {inline ? <EastIcon fontSize="small" /> : secondary ? <ArrowOutwardIcon fontSize="small" /> : <FlareIcon fontSize="small" />}
    </Box>
  );
}

export default HomePage;