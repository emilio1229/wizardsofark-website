import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { woaTokens } from '../../theme/tokens';

type ArcaneStaffProps = {
  colour?: string;
  glowing?: boolean;
  reducedMotion?: boolean;
  width?: number | string;
  height?: number | string;
};

/**
 * Council staff artwork with transparent backdrop.
 * Soft aura + glow tint follow the active member's energy colour.
 */
export function ArcaneStaff({
  colour = woaTokens.colours.primary.main,
  glowing = false,
  reducedMotion = false,
  width = '100%',
  height = '100%',
}: ArcaneStaffProps): JSX.Element {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width,
        height,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: reducedMotion || !glowing ? undefined : 'woa-staff-breathe 2.6s ease-in-out infinite',
        '@keyframes woa-staff-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75%',
          height: '30%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colour, glowing ? 0.5 : 0.22)} 0%, transparent 72%)`,
          filter: `blur(${glowing ? 20 : 12}px)`,
          transition: `background ${woaTokens.motion.normal}ms ease, filter ${woaTokens.motion.normal}ms ease`,
        }}
      />

      <Box
        component="img"
        src="/assets/effects/arcane-staff.png"
        alt=""
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: glowing
            ? `drop-shadow(0 0 14px ${alpha(colour, 0.7)}) drop-shadow(0 0 32px ${alpha(colour, 0.35)})`
            : `drop-shadow(0 0 10px ${alpha(colour, 0.3)})`,
          transition: `filter ${woaTokens.motion.normal}ms ease`,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 16%, ${alpha(colour, glowing ? 0.22 : 0.1)} 0%, transparent 40%)`,
          mixBlendMode: 'soft-light',
          transition: `background ${woaTokens.motion.normal}ms ease`,
        }}
      />
    </Box>
  );
}

export default ArcaneStaff;
