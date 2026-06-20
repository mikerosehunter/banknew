import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Errors from './pages/Errors';
import ErrorDetail from './pages/ErrorDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Banks from './pages/Banks';
import Monitoring from './pages/Monitoring';
import Publish from './pages/Publish';

// Public Pages
import Home from './pages/public/Home';
import PublicArticle from './pages/public/PublicArticle';
// We will create PublicBanks and PublicBankDetail later if needed
// import PublicBanks from './pages/public/PublicBanks';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Consumer Site */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="article/:slug" element={<PublicArticle />} />
          {/* <Route path="banks" element={<PublicBanks />} /> */}
        </Route>

        {/* Protected Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="errors" element={<Errors />} />
          <Route path="errors/:id" element={<ErrorDetail />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:id" element={<ArticleDetail />} />
          <Route path="banks" element={<Banks />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="publish" element={<Publish />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
