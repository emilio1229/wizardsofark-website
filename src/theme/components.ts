import type { ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { woaTokens } from './tokens';

export const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: woaTokens.colours.background.default,
        backgroundImage: woaTokens.gradients.ambient,
        backgroundAttachment: 'fixed',
        color: woaTokens.colours.text.primary,
      },
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
      img: {
        maxWidth: '100%',
        display: 'block',
      },
      '::selection': {
        background: alpha(woaTokens.colours.primary.main, 0.45),
        color: '#fff',
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
          scrollBehavior: 'auto !important',
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: alpha(woaTokens.colours.background.default, 0.82),
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${woaTokens.colours.border.default}`,
        boxShadow: 'none',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: woaTokens.colours.background.paper,
        border: `1px solid ${woaTokens.colours.border.default}`,
        boxShadow: woaTokens.glow.card,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: woaTokens.gradients.panel,
        backgroundColor: woaTokens.colours.background.elevated,
        border: `1px solid ${woaTokens.colours.border.default}`,
        borderRadius: woaTokens.radius.md,
        boxShadow: woaTokens.glow.card,
        transition: `border-color ${woaTokens.motion.normal}ms ease, box-shadow ${woaTokens.motion.normal}ms ease, transform ${woaTokens.motion.normal}ms ease`,
        '&:hover': {
          borderColor: woaTokens.colours.border.hover,
        },
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: woaTokens.radius.sm,
        paddingInline: '1.35rem',
        paddingBlock: '0.7rem',
        fontWeight: 600,
        transition: `box-shadow ${woaTokens.motion.normal}ms ease, transform ${woaTokens.motion.fast}ms ease, background ${woaTokens.motion.normal}ms ease`,
        '&:focus-visible': {
          outline: `2px solid ${woaTokens.colours.primary.light}`,
          outlineOffset: 2,
        },
      },
      containedPrimary: {
        backgroundImage: woaTokens.gradients.primaryButton,
        color: '#FFFFFF',
        boxShadow: woaTokens.glow.softPurple,
        '&:hover': {
          backgroundImage: woaTokens.gradients.primaryButton,
          boxShadow: woaTokens.glow.strongPurple,
        },
      },
      outlinedPrimary: {
        borderColor: woaTokens.colours.border.hover,
        color: woaTokens.colours.text.primary,
        backgroundColor: alpha(woaTokens.colours.background.elevated, 0.55),
        '&:hover': {
          borderColor: woaTokens.colours.primary.light,
          backgroundColor: alpha(woaTokens.colours.primary.main, 0.12),
          boxShadow: woaTokens.glow.softPurple,
        },
      },
      textPrimary: {
        color: woaTokens.colours.primary.light,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: woaTokens.radius.sm,
        borderColor: woaTokens.colours.border.default,
        backgroundColor: alpha(woaTokens.colours.background.elevated, 0.8),
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 2,
        borderRadius: 2,
        backgroundColor: woaTokens.colours.primary.main,
        boxShadow: woaTokens.glow.softPurple,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        minHeight: 48,
        color: woaTokens.colours.text.secondary,
        '&.Mui-selected': {
          color: woaTokens.colours.text.primary,
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: woaTokens.radius.lg,
        border: `1px solid ${woaTokens.colours.border.default}`,
        backgroundImage: woaTokens.gradients.panel,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: woaTokens.colours.background.paper,
        backgroundImage: woaTokens.gradients.panel,
        borderLeft: `1px solid ${woaTokens.colours.border.default}`,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: woaTokens.colours.background.elevated,
        border: `1px solid ${woaTokens.colours.border.default}`,
        color: woaTokens.colours.text.primary,
        fontSize: '0.75rem',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        backgroundColor: alpha(woaTokens.colours.primary.main, 0.15),
      },
      bar: {
        borderRadius: 999,
        backgroundImage: woaTokens.gradients.primaryButton,
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(woaTokens.colours.primary.main, 0.12),
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: woaTokens.radius.sm,
        '&:focus-visible': {
          outline: `2px solid ${woaTokens.colours.primary.light}`,
          outlineOffset: 2,
        },
      },
    },
  },
};
