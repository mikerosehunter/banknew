import { useState } from 'react';
import { Search, Bell, RefreshCw, Settings } from 'lucide-react';
import { triggerMonitoring } from '../lib/api';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Real-time banking error intelligence overview' },
  '/errors': { title: 'Error Intelligence', subtitle: 'Discovered banking errors and AI analysis' },
  '/articles': { title: 'Content Hub', subtitle: 'AI-generated SEO articles and publishing' },
  '/banks': { title: 'Bank Database', subtitle: 'US bank registry with monitoring metadata' },
  '/monitoring': { title: 'Monitoring Engine', subtitle: 'Crawler runs and schedule management' },
  '/publish': { title: 'CMS Publisher', subtitle: 'Content publishing queue and status' },
};

export default function TopBar({ onRefresh }) {
  const [scanning, setScanning] = useState(false);
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const pageInfo = PAGE_TITLES[location.pathname] || PAGE_TITLES['/'];

  const handleScan = async () => {
    setScanning(true);
    try {
      await triggerMonitoring();
      setNotification({ type: 'success', msg: 'Monitoring run started! Results will appear shortly.' });
      setTimeout(() => { setNotification(null); if (onRefresh) onRefresh(); }, 3000);
    } catch (e) {
      setNotification({ type: 'error', msg: 'Failed to start monitoring run.' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setTimeout(() => setScanning(false), 2000);
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06]"
            style={{ background: 'rgba(8,14,26,0.7)', backdropFilter: 'blur(20px)' }}>
      <div>
        <h1 className="text-lg font-bold text-white">{pageInfo.title}</h1>
        <p className="text-xs text-dark-500 mt-0.5">{pageInfo.subtitle}</p>
      </div>
      
      <div className="flex items-center gap-3">
        {notification && (
          <div className={`px-4 py-2 rounded-xl text-xs font-medium border animate-fade-in ${
            notification.type === 'success' 
              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {notification.msg}
          </div>
        )}
        
        {/* Scan button */}
        <button
          id="trigger-monitoring"
          onClick={handleScan}
          disabled={scanning}
          className="btn-primary text-xs"
        >
          <RefreshCw size={13} className={scanning ? 'animate-spin' : ''} />
          {scanning ? 'Scanning...' : 'Run Monitor'}
        </button>
        
        {/* Notifications */}
        <button className="relative btn-ghost w-9 h-9 p-0 flex items-center justify-center rounded-xl">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="btn-ghost w-9 h-9 p-0 flex items-center justify-center rounded-xl">
          <Settings size={15} />
        </button>
        
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
             style={{ background: 'linear-gradient(135deg, #00C6FF, #0072FF)' }}>
          A
        </div>
      </div>
    </header>
  );
}
