import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import ArticlesAdmin from './pages/Articles';
import Publish from './pages/Publish';


// Public Pages
import Home from './pages/public/Home';
import PublicArticle from './pages/public/PublicArticle';
// import CategoryArchive from './pages/public/CategoryArchive';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Consumer Site */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="article/:slug" element={<PublicArticle />} />
          {/* <Route path="category/:slug" element={<CategoryArchive />} /> */}
        </Route>

        {/* Protected Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticlesAdmin />} />
          <Route path="publish" element={<Publish />} />
        </Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
