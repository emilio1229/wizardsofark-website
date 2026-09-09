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
        height: isHome ? '100dvh' : undefined,
        maxHeight: isHome ? '100dvh' : undefined,
        overflow: isHome ? 'hidden' : undefined,
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
          display: isHome ? 'flex' : undefined,
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
