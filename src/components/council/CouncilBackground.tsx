import type { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { woaTokens } from '../../theme/tokens';

type CouncilBackgroundProps = PropsWithChildren<{
  energyColor?: string;
  /** Edge-to-edge stage (no card chrome). */
  fullBleed?: boolean;
  minHeight?: object | string | number;
}>;

export function CouncilBackground({
  children,
  energyColor,
  fullBleed = false,
  minHeight,
}: CouncilBackgroundProps): JSX.Element {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        borderRadius: fullBleed ? 0 : `${woaTokens.radius.lg}px`,
        border: fullBleed ? 'none' : `1px solid ${woaTokens.colours.border.default}`,
        backgroundImage: `
          linear-gradient(180deg, rgba(5,8,17,0.72) 0%, rgba(5,8,17,0.88) 45%, rgba(5,8,17,0.96) 100%),
          radial-gradient(ellipse at 50% 35%, ${alpha(energyColor || woaTokens.colours.primary.main, 0.22)}, transparent 58%),
          url(/assets/gallery/gallery15.png)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        minHeight: minHeight ?? (fullBleed ? { xs: '100svh', md: '100dvh' } : { xs: 420, md: 640 }),
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 18% 78%, ${alpha(woaTokens.colours.primary.main, 0.14)}, transparent 38%),
            radial-gradient(circle at 88% 18%, ${alpha(energyColor || woaTokens.colours.secondary.main, 0.12)}, transparent 32%)
          `,
          pointerEvents: 'none',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, height: '100%', minHeight: 'inherit' }}>{children}</Box>
    </Box>
  );
}

export default CouncilBackground;
