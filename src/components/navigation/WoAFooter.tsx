import { Box, Container, IconButton, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import RedditIcon from '@mui/icons-material/Reddit';
import { footerLinks, siteMeta } from '../../data/site';
import { FantasyDivider } from '../common/GlassPanel';
import { woaTokens } from '../../theme/tokens';

function DiscordGlyph(): JSX.Element {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ width: 22, height: 22, fill: 'currentColor' }}
      aria-hidden
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </Box>
  );
}

export function WoAFooter(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        flexShrink: 0,
        borderTop: `1px solid ${woaTokens.colours.border.default}`,
        backgroundColor: 'background.paper',
        backgroundImage: woaTokens.gradients.panel,
        pt: { xs: 5, md: 6 },
        pb: 4,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: woaTokens.layout.maxWidth, px: { xs: 2, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box component="img" src="/assets/logo.png" alt="" sx={{ width: 44, height: 44, objectFit: 'contain' }} />
            <Box>
              <Typography variant="brand">WIZARDS OF ARK</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {siteMeta.motto}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5} justifyContent="center">
            {footerLinks.map((link) => (
              <Link
                key={`${link.to}-${link.label}`}
                component={RouterLink}
                to={link.to}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.9rem', '&:hover': { color: 'primary.light' } }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <IconButton aria-label="Discord" href={siteMeta.socials.discord} target="_blank" rel="noreferrer" sx={{ color: 'text.secondary' }}>
              <DiscordGlyph />
            </IconButton>
            <IconButton aria-label="YouTube" href={siteMeta.socials.youtube} target="_blank" rel="noreferrer" sx={{ color: 'text.secondary' }}>
              <YouTubeIcon />
            </IconButton>
            <IconButton aria-label="X" href={siteMeta.socials.x} target="_blank" rel="noreferrer" sx={{ color: 'text.secondary' }}>
              <XIcon />
            </IconButton>
            <IconButton aria-label="Reddit" href={siteMeta.socials.reddit} target="_blank" rel="noreferrer" sx={{ color: 'text.secondary' }}>
              <RedditIcon />
            </IconButton>
          </Stack>
        </Stack>

        <FantasyDivider />

        <Typography variant="body2" color="text.muted" textAlign="center" sx={{ letterSpacing: '0.08em' }}>
          {siteMeta.tagline}
        </Typography>
      </Container>
    </Box>
  );
}
