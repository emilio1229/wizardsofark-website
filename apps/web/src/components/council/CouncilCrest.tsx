import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { woaTokens } from '../../theme/tokens';

type CouncilCrestProps = {
  energyColor?: string;
  pulsing?: boolean;
  reducedMotion?: boolean;
  size?: number;
};

export function CouncilCrest({
  energyColor = woaTokens.colours.primary.main,
  pulsing = false,
  reducedMotion = false,
  size = 160,
}: CouncilCrestProps): JSX.Element {
  const accent = energyColor;

  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {/* Outer rotating rune ring */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `1px dashed ${alpha(accent, 0.45)}`,
          boxShadow: `0 0 24px ${alpha(accent, 0.25)}, inset 0 0 24px ${alpha(woaTokens.colours.primary.main, 0.15)}`,
          animation: reducedMotion ? undefined : 'woa-crest-spin 28s linear infinite',
          '@keyframes woa-crest-spin': {
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />

      {/* Soft ambient pulse */}
      <Box
        sx={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(accent, pulsing ? 0.35 : 0.18)} 0%, ${alpha(woaTokens.colours.primary.main, 0.12)} 45%, transparent 70%)`,
          animation:
            reducedMotion || !pulsing
              ? reducedMotion
                ? undefined
                : 'woa-crest-breathe 3.2s ease-in-out infinite'
              : 'woa-crest-pulse 0.55s ease-out',
          '@keyframes woa-crest-breathe': {
            '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.04)' },
          },
          '@keyframes woa-crest-pulse': {
            '0%': { transform: 'scale(0.92)', opacity: 0.4 },
            '50%': { transform: 'scale(1.08)', opacity: 1 },
            '100%': { transform: 'scale(1)', opacity: 0.85 },
          },
        }}
      />

      {/* Inner violet ring */}
      <Box
        sx={{
          position: 'absolute',
          inset: '14%',
          borderRadius: '50%',
          border: `2px solid ${alpha(woaTokens.colours.primary.main, 0.55)}`,
          boxShadow: `0 0 18px ${alpha(accent, 0.35)}`,
        }}
      />

      {/* Magical particles */}
      {!reducedMotion
        ? [0, 1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: alpha(accent, 0.85),
                boxShadow: `0 0 8px ${accent}`,
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 72}deg) translateY(-${size * 0.42}px)`,
                animation: `woa-particle ${2.4 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
                '@keyframes woa-particle': {
                  '0%, 100%': { opacity: 0.35 },
                  '50%': { opacity: 1 },
                },
              }}
            />
          ))
        : null}

      <Box
        component="img"
        src="/assets/logo.png"
        alt=""
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '58%',
          height: '58%',
          objectFit: 'contain',
          filter: `drop-shadow(0 0 16px ${alpha(accent, 0.55)}) drop-shadow(0 0 8px ${alpha(woaTokens.colours.primary.main, 0.45)})`,
          transition: `filter ${woaTokens.motion.normal}ms ease`,
        }}
      />
    </Box>
  );
}

export default CouncilCrest;
