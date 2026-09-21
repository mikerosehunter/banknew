import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Lock, KeyRound, Eye, EyeOff, Shield, AlertCircle, ArrowRight } from 'lucide-react';

const ADMIN_PASSWORD = 'Simple@#123';
const AUTH_STORAGE_KEY = 'blo_admin_authenticated';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isAuth = sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    setIsAuthenticated(isAuth);
    setCheckingAuth(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setError('Invalid administrative password. Access denied.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
    setError('');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center text-slate-400">
        Authenticating...
      </div>
    );
  }

  // If not authenticated, display the secure admin lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-4 relative overflow-hidden text-slate-200">
        {/* Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand Logo & Lock Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 border border-blue-400/30">
              <Lock size={30} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">BankLoginOnline Admin</h1>
            <p className="text-sm text-slate-400 mt-1">Authorized personnel only. Please enter the master access key.</p>
          </div>

          {/* Login Card */}
          <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/60">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter admin password..."
                    autoFocus
                    required
                    className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs font-medium animate-shake">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] text-sm"
              >
                <span>Unlock Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
              <a
                href="/"
                className="text-xs text-slate-400 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
              >
                ← Return to Public Website
              </a>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-slate-500">
            Protected by BankLoginOnline Security Engine
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="flex h-screen overflow-hidden bg-[#080e1a] text-slate-300">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
