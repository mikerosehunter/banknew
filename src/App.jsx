import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import ArticlesAdmin from './pages/Articles';
import CategoriesAdmin from './pages/Categories';

// Public Pages
import Home from './pages/public/Home';
import PublicArticle from './pages/public/PublicArticle';
import CategoryArchive from './pages/public/CategoryArchive';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Disclaimer from './pages/public/Disclaimer';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Consumer Site */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="article/:slug" element={<PublicArticle />} />
          <Route path="guides/:slug" element={<PublicArticle />} />
          <Route path="banks/:slug" element={<CategoryArchive />} />
          <Route path="category/:slug" element={<CategoryArchive />} />
          <Route path="issues/:slug" element={<CategoryArchive />} />
          <Route path="about" element={<About />} />
          <Route path="about-us" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="banking-disclaimer" element={<Disclaimer />} />
        </Route>

        {/* Protected Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticlesAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="publish" element={<Navigate to="/admin" replace />} />
        </Route>



        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
