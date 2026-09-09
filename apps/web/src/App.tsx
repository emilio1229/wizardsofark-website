import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import AppLayout from './layouts/AppLayout';
import ScrollToTop from './components/ScrollToTop';

const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ServersPage = lazy(() => import('./pages/Servers/ServersPage'));
const ServerDetailPage = lazy(() => import('./pages/ServerDetail/ServerDetailPage'));
const CouncilPage = lazy(() => import('./pages/Council/CouncilPage'));
const CommunityPage = lazy(() => import('./pages/Community/CommunityPage'));
const MediaPage = lazy(() => import('./pages/Community/MediaPage'));
const ShopPage = lazy(() => import('./pages/Shop/ShopPage'));
const RulesPage = lazy(() => import('./pages/Rules/RulesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function RouteFallback(): JSX.Element {
  return (
    <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress color="primary" />
    </Box>
  );
}

function App(): JSX.Element {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="servers" element={<ServersPage />} />
            <Route path="servers/:serverId" element={<ServerDetailPage />} />
            <Route path="council" element={<CouncilPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="community/media" element={<MediaPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="store" element={<Navigate to="/shop" replace />} />
            <Route path="server-info" element={<Navigate to="/servers" replace />} />
            <Route path="contact" element={<Navigate to="/community" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
