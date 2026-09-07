import { Route, Routes } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import ScrollToTop from './components/ScrollToTop';
import ContactPage from './pages/ContactPage';
import CouncilPage from './pages/CouncilPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ServerInfoPage from './pages/ServerInfoPage';
import StorePage from './pages/StorePage';

function App(): JSX.Element {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="server-info" element={<ServerInfoPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="council" element={<CouncilPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;