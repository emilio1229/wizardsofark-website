import type { ThemeOptions } from '@mui/material/styles';

const displayFont = '"Cinzel", Georgia, serif';
const uiFont = '"Inter", "Manrope", system-ui, sans-serif';

export const typography: ThemeOptions['typography'] = {
  fontFamily: uiFont,
  h1: {
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: 'clamp(2.625rem, 5vw, 3.25rem)',
    lineHeight: 1.1,
    letterSpacing: '0.04em',
  },
  h2: {
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: 'clamp(1.75rem, 3vw, 2.125rem)',
    lineHeight: 1.15,
    letterSpacing: '0.04em',
  },
  h3: {
    fontFamily: displayFont,
    fontWeight: 600,
    fontSize: 'clamp(1.375rem, 2.2vw, 1.75rem)',
    lineHeight: 1.2,
    letterSpacing: '0.03em',
  },
  h4: {
    fontFamily: displayFont,
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.25,
    letterSpacing: '0.03em',
  },
  h5: {
    fontFamily: displayFont,
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.3,
  },
  h6: {
    fontFamily: displayFont,
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.35,
  },
  subtitle1: {
    fontFamily: uiFont,
    fontWeight: 500,
    fontSize: '1rem',
  },
  subtitle2: {
    fontFamily: uiFont,
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  body1: {
    fontFamily: uiFont,
    fontSize: '1rem',
    lineHeight: 1.7,
  },
  body2: {
    fontFamily: uiFont,
    fontSize: '0.875rem',
    lineHeight: 1.65,
  },
  button: {
    fontFamily: uiFont,
    textTransform: 'none',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  caption: {
    fontFamily: uiFont,
    fontSize: '0.75rem',
    letterSpacing: '0.04em',
  },
  overline: {
    fontFamily: uiFont,
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
  },
  brand: {
    fontFamily: displayFont,
    fontSize: '1.05rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    lineHeight: 1.2,
  },
  heroTitle: {
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: 'clamp(2.75rem, 7vw, 4.5rem)',
    lineHeight: 1.05,
    letterSpacing: '0.06em',
  },
  sectionTitle: {
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: 'clamp(1.75rem, 3vw, 2.125rem)',
    lineHeight: 1.15,
    letterSpacing: '0.04em',
  },
};
