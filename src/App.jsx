import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Errors from './pages/Errors';
import ErrorDetail from './pages/ErrorDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Banks from './pages/Banks';
import Monitoring from './pages/Monitoring';
import Publish from './pages/Publish';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/errors" element={<Errors />} />
              <Route path="/errors/:id" element={<ErrorDetail />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/banks" element={<Banks />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/publish" element={<Publish />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
