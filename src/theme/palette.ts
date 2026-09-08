import { woaTokens } from './tokens';

declare module '@mui/material/styles' {
  interface Palette {
    arcane: {
      main: string;
      glow: string;
    };
    gold: {
      main: string;
      light: string;
    };
    status: {
      online: string;
      offline: string;
      warning: string;
      maintenance: string;
      restarting: string;
    };
    border: {
      default: string;
      hover: string;
    };
  }

  interface PaletteOptions {
    arcane?: {
      main: string;
      glow: string;
    };
    gold?: {
      main: string;
      light: string;
    };
    status?: {
      online: string;
      offline: string;
      warning: string;
      maintenance: string;
      restarting: string;
    };
    border?: {
      default: string;
      hover: string;
    };
  }

  interface TypeBackground {
    elevated: string;
    overlay: string;
  }

  interface TypeText {
    muted: string;
  }
}

export const palette = {
  mode: 'dark' as const,
  primary: {
    main: woaTokens.colours.primary.main,
    light: woaTokens.colours.primary.light,
    dark: woaTokens.colours.primary.dark,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: woaTokens.colours.secondary.main,
    dark: woaTokens.colours.secondary.dark,
    contrastText: '#050811',
  },
  background: {
    default: woaTokens.colours.background.default,
    paper: woaTokens.colours.background.paper,
    elevated: woaTokens.colours.background.elevated,
    overlay: woaTokens.colours.background.overlay,
  },
  text: {
    primary: woaTokens.colours.text.primary,
    secondary: woaTokens.colours.text.secondary,
    muted: woaTokens.colours.text.muted,
    disabled: woaTokens.colours.text.muted,
  },
  divider: woaTokens.colours.border.default,
  error: {
    main: woaTokens.colours.status.offline,
  },
  warning: {
    main: woaTokens.colours.status.warning,
  },
  success: {
    main: woaTokens.colours.status.online,
  },
  info: {
    main: woaTokens.colours.secondary.main,
  },
  arcane: {
    main: woaTokens.colours.arcane.main,
    glow: woaTokens.colours.arcane.glow,
  },
  gold: {
    main: woaTokens.colours.gold.main,
    light: woaTokens.colours.gold.light,
  },
  status: {
    online: woaTokens.colours.status.online,
    offline: woaTokens.colours.status.offline,
    warning: woaTokens.colours.status.warning,
    maintenance: woaTokens.colours.status.maintenance,
    restarting: woaTokens.colours.status.restarting,
  },
  border: {
    default: woaTokens.colours.border.default,
    hover: woaTokens.colours.border.hover,
  },
};
