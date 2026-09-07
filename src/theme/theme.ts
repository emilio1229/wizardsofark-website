import { alpha, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c2141',
      light: '#5d4a7e',
      dark: '#170f26',
    },
    secondary: {
      main: '#c9a86a',
      light: '#e5cd9f',
      dark: '#8f6a2c',
    },
    background: {
      default: '#201338',
      paper: '#fbf8f0',
    },
    text: {
      primary: '#171512',
      secondary: '#5e5a52',
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: 'Space Grotesk, system-ui, sans-serif',
    h1: {
      fontFamily: 'Spectral, serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: 'Spectral, serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: 'Spectral, serif',
      fontWeight: 800,
    },
    h4: {
      fontFamily: 'Spectral, serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Spectral, serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Spectral, serif',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    brand: {
      fontFamily: 'Uncial Antiqua, serif',
      fontSize: '1.15rem',
      lineHeight: 1.2,
    },
    heroTitle: {
      fontFamily: 'Spectral, serif',
      fontWeight: 800,
      fontSize: 'clamp(2.8rem, 6vw, 6.4rem)',
      lineHeight: 0.92,
      letterSpacing: '-0.04em',
    },
    sectionTitle: {
      fontFamily: 'Spectral, serif',
      fontSize: 'clamp(1.8rem, 2vw, 3rem)',
      fontWeight: 800,
      lineHeight: 1.02,
      letterSpacing: '-0.03em',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#2c2141', 0.88),
          color: '#e5cd9f',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 18px 48px rgba(20, 18, 14, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: '1.25rem',
          paddingBlock: '0.8rem',
        },
        containedPrimary: {
          color: '#f7f2e8',
          boxShadow: '0 12px 30px rgba(44, 33, 65, 0.24)',
        },
        outlinedPrimary: {
          borderColor: alpha('#2c2141', 0.18),
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid rgba(23, 21, 18, 0.08)',
          backgroundColor: 'rgba(251, 248, 240, 0.98)',
          '&::before': {
            display: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          borderColor: alpha('#2c2141', 0.12),
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2c2141',
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;