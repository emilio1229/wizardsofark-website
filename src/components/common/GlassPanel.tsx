import type { PropsWithChildren, ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { woaTokens } from '../../theme/tokens';

type GlassPanelProps = PropsWithChildren<{
  sx?: SxProps<Theme>;
  component?: React.ElementType;
}>;

export function GlassPanel({ children, sx, component = 'div' }: GlassPanelProps): JSX.Element {
  return (
    <Paper
      component={component}
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: `${woaTokens.radius.md}px`,
        backgroundImage: woaTokens.gradients.panel,
        backgroundColor: alpha(woaTokens.colours.background.elevated, 0.92),
        border: `1px solid ${woaTokens.colours.border.default}`,
        backdropFilter: 'blur(14px)',
        boxShadow: woaTokens.glow.card,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

type ArcaneCardProps = PropsWithChildren<{
  sx?: SxProps<Theme>;
  onClick?: () => void;
  accentColour?: string;
}>;

export function ArcaneCard({ children, sx, onClick, accentColour }: ArcaneCardProps): JSX.Element {
  return (
    <Box
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      sx={{
        p: 2.5,
        borderRadius: `${woaTokens.radius.md}px`,
        backgroundImage: woaTokens.gradients.panel,
        border: `1px solid ${accentColour ? alpha(accentColour, 0.45) : woaTokens.colours.border.default}`,
        boxShadow: woaTokens.glow.card,
        cursor: onClick ? 'pointer' : 'default',
        transition: `transform ${woaTokens.motion.normal}ms ease, border-color ${woaTokens.motion.normal}ms ease, box-shadow ${woaTokens.motion.normal}ms ease`,
        '&:hover': onClick
          ? {
              transform: 'translateY(-3px)',
              borderColor: accentColour || woaTokens.colours.border.hover,
              boxShadow: accentColour
                ? `0 0 20px ${alpha(accentColour, 0.35)}, ${woaTokens.glow.card}`
                : woaTokens.glow.magic,
            }
          : undefined,
        '&:focus-visible': onClick
          ? {
              outline: `2px solid ${woaTokens.colours.primary.light}`,
              outlineOffset: 2,
            }
          : undefined,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  action,
}: SectionHeaderProps): JSX.Element {
  return (
    <Box
      sx={{
        mb: { xs: 3, md: 4 },
        textAlign: align,
        display: 'flex',
        flexDirection: { xs: 'column', md: action ? 'row' : 'column' },
        alignItems: { xs: align === 'center' ? 'center' : 'flex-start', md: action ? 'flex-end' : align === 'center' ? 'center' : 'flex-start' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box sx={{ maxWidth: 720 }}>
        {eyebrow ? (
          <Typography variant="overline" sx={{ color: 'gold.main', display: 'block', mb: 1 }}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="sectionTitle" component="h1" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.25 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {action}
    </Box>
  );
}

export function FantasyDivider({ colour }: { colour?: string }): JSX.Element {
  const line = colour || woaTokens.colours.gold.main;
  return (
    <Box
      aria-hidden
      sx={{
        height: 1,
        width: '100%',
        my: 2,
        background: `linear-gradient(90deg, transparent, ${alpha(line, 0.7)}, transparent)`,
      }}
    />
  );
}

type StatusDotProps = {
  colour: string;
  label?: string;
  size?: number;
  pulse?: boolean;
};

export function StatusDot({ colour, label, size = 8, pulse }: StatusDotProps): JSX.Element {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box
        aria-hidden
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: colour,
          boxShadow: `0 0 10px ${alpha(colour, 0.7)}`,
          animation: pulse ? 'woa-pulse 2s ease-in-out infinite' : undefined,
          '@keyframes woa-pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.55 },
          },
        }}
      />
      {label ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {label}
        </Typography>
      ) : null}
    </Box>
  );
}
