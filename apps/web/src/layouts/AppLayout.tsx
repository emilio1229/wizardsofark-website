import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { WoAHeader } from '../components/navigation/WoAHeader';
import { WoAFooter } from '../components/navigation/WoAFooter';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useServerLiveUpdates } from '../store/useServerLiveUpdates';

export function AppLayout(): JSX.Element {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  useServerLiveUpdates();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // Desktop home stays one viewport; mobile must scroll when hero + cards + footer stack.
        height: isHome ? { xs: 'auto', md: '100dvh' } : undefined,
        maxHeight: isHome ? { xs: 'none', md: '100dvh' } : undefined,
        overflow: isHome ? { xs: 'visible', md: 'hidden' } : undefined,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <WoAHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          pt: { xs: '64px', md: '72px' },
          display: isHome ? { xs: 'block', md: 'flex' } : undefined,
          flexDirection: isHome ? 'column' : undefined,
        }}
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <WoAFooter />
    </Box>
  );
}

export default AppLayout;
