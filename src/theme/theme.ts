import { createTheme } from '@mui/material/styles';
import { components } from './components';
import { palette } from './palette';
import { typography } from './typography';
import { woaTokens } from './tokens';

const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: woaTokens.radius.md,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components,
});

export default theme;
export { woaTokens };
