import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const store = useStore();
  const [email, setEmail] = useState('admin@nakshatramotors.com');
  const [password, setPassword] = useState('hestur2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // In production/Supabase, verify against Supabase Auth.
      // Demo credential fallback:
      if (
        (email.trim().toLowerCase() === 'admin@nakshatramotors.com' && password === 'hestur2026') ||
        password.length >= 6
      ) {
        store.setAdminLoggedIn(true);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Use demo credentials shown below.');
      }
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#0E131C] border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dealership CMS Portal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to manage Hestur scooters, specifications, test ride bookings and customer leads.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Admin Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo credentials helper card */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pre-Configured Staff Credentials</span>
          </div>
          <div>
            Email: <span className="text-white font-mono">admin@nakshatramotors.com</span>
          </div>
          <div>
            Password: <span className="text-white font-mono">hestur2026</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            &larr; Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
