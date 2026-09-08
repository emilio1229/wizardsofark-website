import type { ReactNode } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { woaTokens } from '../../theme/tokens';

type HeroAction = {
  label: string;
  href: string;
  external?: boolean;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  minHeight?: { xs?: string | number; md?: string | number };
  /** Fill the parent main area (use with a fit-to-viewport layout). */
  fillParent?: boolean;
  /** Break out under the fixed header and fill the viewport. */
  fullViewport?: boolean;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  align?: 'left' | 'center';
  children?: ReactNode;
  /** Full-width content below the title stack (e.g. feature cards). */
  bottomContent?: ReactNode;
  /** Push the title block down from the top of the hero (e.g. "33%"). */
  titleOffset?: string | { xs?: string; md?: string };
  /** Extra space between the title block and bottomContent. Use "grow" to fill leftover room. */
  bottomGap?: number | { xs?: number; md?: number } | 'grow';
  /** Smaller promo banner for secondary pages (supports overlapping content). */
  compact?: boolean;
  overlay?: 'horizontal' | 'vertical' | 'both';
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  description,
  backgroundImage,
  minHeight,
  fillParent = false,
  fullViewport = false,
  compact = false,
  primaryAction,
  secondaryAction,
  align = 'left',
  children,
  bottomContent,
  titleOffset,
  bottomGap = { xs: 6, md: 8 },
  overlay = 'both',
}: PageHeroProps): JSX.Element {
  const renderAction = (action: HeroAction | undefined, variant: ButtonProps['variant']) => {
    if (!action) {
      return null;
    }

    if (action.external) {
      return (
        <Button
          variant={variant}
          color="primary"
          href={action.href}
          target="_blank"
          rel="noreferrer"
          size={compact ? 'small' : 'medium'}
        >
          {action.label}
        </Button>
      );
    }

    return (
      <Button
        variant={variant}
        color="primary"
        component={RouterLink}
        to={action.href}
        size={compact ? 'small' : 'medium'}
      >
        {action.label}
      </Button>
    );
  };

  const bleedUnderHeader = fillParent || fullViewport;
  const resolvedMinHeight = fillParent
    ? undefined
    : fullViewport
      ? { xs: '100svh', md: '100dvh' }
      : (minHeight ?? (compact ? { xs: '28vh', md: '32vh' } : { xs: '48vh', md: '56vh' }));

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...(fillParent
          ? {
              flex: 1,
              minHeight: 0,
              mt: { xs: '-64px', md: '-72px' },
              height: { xs: 'calc(100% + 64px)', md: 'calc(100% + 72px)' },
              width: '100%',
            }
          : {
              minHeight: resolvedMinHeight,
              ...(fullViewport
                ? {
                    mt: { xs: '-64px', md: '-72px' },
                    width: '100%',
                  }
                : null),
            }),
        display: 'flex',
        alignItems: bleedUnderHeader ? 'flex-start' : 'flex-end',
        backgroundColor: 'background.default',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: { xs: 'center', md: 'center right' },
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            overlay === 'horizontal'
              ? woaTokens.gradients.heroOverlay
              : overlay === 'vertical'
                ? woaTokens.gradients.heroOverlayVertical
                : `${woaTokens.gradients.heroOverlay}, ${woaTokens.gradients.heroOverlayVertical}`,
        }}
      />
      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          maxWidth: woaTokens.layout.maxWidth,
          height: fillParent ? '100%' : undefined,
          pt: titleOffset
            ? titleOffset
            : bleedUnderHeader
              ? { xs: '96px', md: '120px' }
              : compact
                ? { xs: 3, md: 4 }
                : { xs: 6, md: 8 },
          // Extra bottom padding so overlapping panels can sit on the banner.
          pb: compact ? { xs: 3, md: 4 } : { xs: 2, md: 2.5 },
          px: { xs: 2, md: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: 0,
        }}
      >
        <Stack
          spacing={compact ? { xs: 1.25, md: 1.5 } : { xs: 1.75, md: 2 }}
          maxWidth={compact ? 640 : 720}
          textAlign={align}
          mx={align === 'center' ? 'auto' : 0}
          sx={{ flexShrink: 0 }}
        >
          {eyebrow ? (
            <Typography variant="overline" sx={{ color: 'gold.main' }}>
              {eyebrow}
            </Typography>
          ) : null}
          <Typography
            variant={compact ? 'sectionTitle' : 'heroTitle'}
            sx={{ color: 'text.primary', textShadow: '0 8px 40px rgba(0,0,0,.55)' }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant={compact ? 'subtitle1' : 'h5'}
              sx={{ color: 'gold.light', fontFamily: '"Cinzel", Georgia, serif', fontWeight: 500 }}
            >
              {subtitle}
            </Typography>
          ) : null}
          {description ? (
            <Typography
              variant={compact ? 'body2' : 'body1'}
              color="text.secondary"
              sx={{ maxWidth: compact ? 480 : 560 }}
            >
              {description}
            </Typography>
          ) : null}
          {(primaryAction || secondaryAction) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75} justifyContent={align === 'center' ? 'center' : 'flex-start'}>
              {renderAction(primaryAction, 'contained')}
              {renderAction(secondaryAction, 'outlined')}
            </Stack>
          )}
          {children}
        </Stack>
        {bottomContent ? (
          bottomGap === 'grow' ? (
            <Box
              sx={{
                flexGrow: 1,
                minHeight: { xs: 48, md: 72 },
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box sx={{ width: '100%' }}>{bottomContent}</Box>
            </Box>
          ) : (
            <Box sx={{ width: '100%', mt: bottomGap, flexShrink: 0 }}>{bottomContent}</Box>
          )
        ) : null}
      </Container>
    </Box>
  );
}

export default PageHero;
