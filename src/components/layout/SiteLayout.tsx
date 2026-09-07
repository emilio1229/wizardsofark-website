import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, Outlet } from 'react-router-dom';
import { navLinks, siteMeta } from '../../data/siteContent';

function SiteLayout(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 32 });

  const toggleDrawer = () => {
    setMobileOpen((open) => !open);
  };

  const navItems = navLinks.map((link) => (
    <Button
      key={link.to}
      component={NavLink}
      to={link.to}
      end={link.to === '/'}
      onClick={() => setMobileOpen(false)}
      sx={{
        color: 'secondary.light',
        px: 1.6,
        py: 0.9,
        borderRadius: 999,
        fontSize: '0.9rem',
        letterSpacing: '0.04em',
        transition: 'background-color 180ms ease, color 180ms ease, transform 180ms ease',
        '&.active': {
          color: 'secondary.main',
          backgroundColor: scrolled ? 'rgba(201, 168, 106, 0.16)' : 'rgba(201, 168, 106, 0.14)',
        },
        '&:hover': {
          backgroundColor: scrolled ? 'rgba(201, 168, 106, 0.12)' : 'rgba(201, 168, 106, 0.1)',
        },
      }}
    >
      {link.label}
    </Button>
  ));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          top: scrolled ? 0 : 18,
          left: { xs: scrolled ? 0 : 12, md: scrolled ? 0 : 24 },
          right: { xs: scrolled ? 0 : 12, md: scrolled ? 0 : 24 },
          width: 'auto',
          borderRadius: scrolled ? 0 : '28px',
          border: scrolled ? 'none' : '1px solid rgba(201, 168, 106, 0.14)',
          backgroundColor: scrolled ? 'rgba(44, 33, 65, 0.96)' : 'rgba(44, 33, 65, 0.86)',
          boxShadow: scrolled ? '0 14px 40px rgba(22, 18, 29, 0.24)' : 'none',
          backdropFilter: 'blur(18px)',
          transition: 'top 220ms ease, left 220ms ease, right 220ms ease, border-radius 220ms ease, background-color 220ms ease, box-shadow 220ms ease',
        }}
      >
        <Toolbar sx={{ minHeight: scrolled ? 72 : 82, px: { xs: 2, md: 3 }, transition: 'min-height 220ms ease' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              component="img"
              src="/assets/logo.png"
              alt="Wizards of Ark logo"
              sx={{ width: scrolled ? 44 : 52, height: scrolled ? 44 : 52, objectFit: 'contain', transition: 'width 220ms ease, height 220ms ease' }}
            />
            <Box>
              <Typography variant="brand" component="div">
                {siteMeta.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(229, 205, 159, 0.78)', letterSpacing: 2.4, textTransform: 'uppercase', opacity: scrolled ? 0.8 : 1, transition: 'opacity 220ms ease' }}>
                {siteMeta.tagline}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.75} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navItems}
            <Button variant="contained" color="primary" href={siteMeta.discordUrl} target="_blank" rel="noreferrer" sx={{ ml: 1.2 }}>
              Discord
            </Button>
          </Stack>

          <IconButton
            color="inherit"
            edge="end"
            onClick={toggleDrawer}
            sx={{ display: { md: 'none' }, border: '1px solid rgba(201, 168, 106, 0.24)', borderRadius: 3, color: 'secondary.light' }}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer} PaperProps={{ sx: { width: 280, px: 1, pt: 2 } }}>
        <Typography variant="brand" sx={{ px: 2, pb: 2, color: 'secondary.main' }}>
          Navigate the Realm
        </Typography>
        <Divider sx={{ borderColor: 'rgba(201, 168, 106, 0.18)' }} />
        <Stack spacing={1} sx={{ p: 2 }}>
          {navItems}
          <Button variant="contained" color="primary" href={siteMeta.discordUrl} target="_blank" rel="noreferrer">
            Discord
          </Button>
        </Stack>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 17, md: 19 } }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ borderTop: '1px solid rgba(201, 168, 106, 0.12)', py: 4, mt: 8, backgroundColor: 'primary.dark' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5, color: 'secondary.main' }}>
                {siteMeta.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(229, 205, 159, 0.74)' }}>
                {siteMeta.footer}
              </Typography>
            </Box>
            <Button variant="outlined" color="primary" href={siteMeta.discordUrl} target="_blank" rel="noreferrer">
              Join Discord
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default SiteLayout;