export const woaTokens = {
  colours: {
    background: {
      default: '#050811',
      paper: '#0B1120',
      elevated: '#101829',
      overlay: 'rgba(5, 8, 17, 0.88)',
    },
    primary: {
      main: '#9B5CFF',
      light: '#B983FF',
      dark: '#6E35D8',
    },
    arcane: {
      main: '#7B3FF2',
      glow: '#A968FF',
    },
    secondary: {
      main: '#36CFFF',
      dark: '#158DBB',
    },
    gold: {
      main: '#D6B36A',
      light: '#F0D89A',
    },
    status: {
      online: '#39E875',
      offline: '#FF4F65',
      warning: '#FFB547',
      maintenance: '#9A80FF',
      restarting: '#FFB547',
      possiblyUpdating: '#4F8CFF',
    },
    text: {
      primary: '#F5F3FA',
      secondary: '#A8AEC0',
      muted: '#737B91',
    },
    border: {
      default: 'rgba(151, 116, 255, 0.20)',
      hover: 'rgba(171, 125, 255, 0.55)',
    },
  },
  glow: {
    softPurple: '0 0 24px rgba(155,92,255,.25)',
    strongPurple: '0 0 35px rgba(155,92,255,.55)',
    softCyan: '0 0 20px rgba(54,207,255,.25)',
    card: '0 10px 30px rgba(0,0,0,.35)',
    magic: '0 0 12px rgba(155,92,255,.45), 0 0 30px rgba(155,92,255,.18)',
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  gradients: {
    panel:
      'linear-gradient(180deg, rgba(16, 24, 41, 0.97), rgba(7, 11, 22, 0.97))',
    cardHover:
      'linear-gradient(135deg, rgba(139, 69, 255, 0.22), rgba(54, 207, 255, 0.05))',
    heroOverlay:
      'linear-gradient(90deg, rgba(5, 8, 17, 0.98) 0%, rgba(5, 8, 17, 0.72) 42%, rgba(5, 8, 17, 0.2) 100%)',
    heroOverlayVertical:
      'linear-gradient(180deg, rgba(5, 8, 17, 0.55) 0%, rgba(5, 8, 17, 0.82) 55%, rgba(5, 8, 17, 0.98) 100%)',
    primaryButton:
      'linear-gradient(135deg, #B983FF 0%, #9B5CFF 45%, #6E35D8 100%)',
    ambient:
      'radial-gradient(ellipse at 20% 0%, rgba(155, 92, 255, 0.18), transparent 50%), radial-gradient(ellipse at 90% 20%, rgba(54, 207, 255, 0.08), transparent 40%), radial-gradient(ellipse at 50% 100%, rgba(123, 63, 242, 0.12), transparent 45%)',
  },
  motion: {
    fast: 150,
    normal: 220,
    slow: 350,
    spell: 600,
  },
  layout: {
    maxWidth: 1520,
    contentMaxWidth: 1440,
  },
} as const;

export type WoaTokens = typeof woaTokens;
