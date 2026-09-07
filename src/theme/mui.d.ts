import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    brand: React.CSSProperties;
    heroTitle: React.CSSProperties;
    sectionTitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    brand?: React.CSSProperties;
    heroTitle?: React.CSSProperties;
    sectionTitle?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    brand: true;
    heroTitle: true;
    sectionTitle: true;
  }
}