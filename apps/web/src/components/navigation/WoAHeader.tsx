import { useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink, useLocation } from 'react-router-dom';
import { features } from '../../config/features';
import { navLinks, siteMeta } from '../../data/site';
import { woaTokens } from '../../theme/tokens';

export function WoAHeader(): JSX.Element {
  const theme = useTheme();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });

  // Always close the drawer after navigation (header stays mounted across routes).
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Avoid a stuck-open drawer when rotating/resizing up to desktop.
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const closeMobileNav = () => setMobileOpen(false);
  const toggleMobileNav = () => setMobileOpen((open) => !open);

  const navItem = (link: (typeof navLinks)[number], mobile = false) => (
    <Button
      key={link.to}
      component={NavLink}
      to={link.to}
      end={link.to === '/'}
      onClick={closeMobileNav}
      sx={{
        color: 'text.secondary',
        px: mobile ? 2 : 1.4,
        py: mobile ? 1.2 : 1,
        justifyContent: mobile ? 'flex-start' : 'center',
        fontSize: '0.9rem',
        letterSpacing: '0.03em',
        position: 'relative',
        borderRadius: 0,
        minWidth: 'auto',
        '&.active': {
          color: 'text.primary',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: mobile ? 16 : 12,
            right: mobile ? 'auto' : 12,
            bottom: mobile ? 8 : 4,
            width: mobile ? 28 : 'auto',
            height: 2,
            borderRadius: 2,
            backgroundColor: 'primary.main',
            boxShadow: woaTokens.glow.softPurple,
          },
        },
        '&:hover': {
          color: 'text.primary',
          backgroundColor: alpha(woaTokens.colours.primary.main, 0.08),
        },
      }}
    >
      {link.label}
    </Button>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          // Fixed AppBar + backdrop-filter can composite above MUI Modal/Drawer and
          // steal clicks from the drawer close control; disable blur while open.
          backdropFilter: mobileOpen ? 'none' : undefined,
          WebkitBackdropFilter: mobileOpen ? 'none' : undefined,
          backgroundColor: scrolled
            ? alpha(woaTokens.colours.background.default, 0.92)
            : alpha(woaTokens.colours.background.default, 0.72),
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, md: 72 },
            px: { xs: 1.5, md: 3 },
            maxWidth: woaTokens.layout.maxWidth,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Stack
            component={NavLink}
            to="/"
            direction="row"
            spacing={1.25}
            alignItems="center"
            onClick={closeMobileNav}
            sx={{ color: 'inherit', mr: { md: 3 }, flexShrink: 0 }}
          >
            <Box
              component="img"
              src="/assets/logo.png"
              alt="Wizards of Ark"
              sx={{ width: 40, height: 40, objectFit: 'contain' }}
            />
            <Typography variant="brand" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.primary' }}>
              WIZARDS OF ARK
            </Typography>
          </Stack>

          {!isMobile ? (
            <Stack direction="row" spacing={0.25} sx={{ flexGrow: 1, justifyContent: 'center' }}>
              {navLinks.map((link) => navItem(link))}
            </Stack>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          <Stack direction="row" spacing={0.5} alignItems="center">
            {features.search ? (
              <IconButton aria-label="Search" color="inherit" sx={{ color: 'text.secondary' }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            ) : null}
            {features.themeToggle ? (
              <IconButton
                aria-label="Theme"
                color="inherit"
                sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}
              >
                <DarkModeOutlinedIcon fontSize="small" />
              </IconButton>
            ) : null}
            {features.account ? (
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  ml: 0.5,
                  bgcolor: 'primary.dark',
                  color: 'text.primary',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: `1px solid ${woaTokens.colours.border.default}`,
                }}
                aria-label="Account"
              >
                B
              </Avatar>
            ) : null}
            {isMobile ? (
              <IconButton
                aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={mobileOpen}
                onClick={toggleMobileNav}
                sx={{ color: 'text.primary', ml: 0.5 }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            ) : null}
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobileNav}
        ModalProps={{ keepMounted: true }}
        sx={{ zIndex: (t) => t.zIndex.modal + 1 }}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Typography variant="brand">Navigate</Typography>
          <IconButton aria-label="Close navigation" onClick={closeMobileNav} edge="end">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ borderColor: 'border.default' }} />
        <Stack spacing={0.5} sx={{ p: 1.5 }}>
          {navLinks.map((link) => navItem(link, true))}
          <Button
            variant="contained"
            href={siteMeta.discordUrl}
            target="_blank"
            rel="noreferrer"
            onClick={closeMobileNav}
            sx={{ mt: 2 }}
          >
            Join Discord
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
