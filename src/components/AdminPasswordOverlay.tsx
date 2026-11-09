import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { subscriptionService } from '../lib/subscriptionService';

interface AdminPasswordOverlayProps {
  onAuthenticated: (token?: string) => void;
  onCancel?: () => void;
  adminEmail?: string;
}

export const AdminPasswordOverlay: React.FC<AdminPasswordOverlayProps> = ({
  onAuthenticated,
  onCancel,
  adminEmail = 'yashkhairnar77777@gmail.com',
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const triggerError = (msg: string) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();

    if (!trimmed) {
      triggerError('Please enter the administrator password.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Direct verification for y@ash2013 and server authentication
      if (trimmed === 'y@ash2013') {
        // Also authenticate with backend to retrieve session token
        try {
          const res = await subscriptionService.verifyAdminPassword(trimmed, adminEmail);
          if (res.token) {
            subscriptionService.setAdminAuthToken(res.token);
          }
        } catch {
          // Fallback session token if offline or network hiccup
          subscriptionService.setAdminAuthToken(`adm_local_${Date.now()}`);
        }
        onAuthenticated();
      } else {
        // Try backend verification in case configured differently
        const res = await subscriptionService.verifyAdminPassword(trimmed, adminEmail);
        if (res.success) {
          onAuthenticated(res.token);
        } else {
          triggerError(res.error || 'Incorrect admin password. Access denied.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      triggerError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-950/50 space-y-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Icon */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-amber-500 p-0.5 shadow-xl shadow-rose-500/20">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-white">
              <Lock className="w-8 h-8 text-rose-400" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted Admin Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Admin Password Required
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Please enter the master administrator password to view and manage payment requests.
            </p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <motion.div
              animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="relative"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter password to access admin dashboard..."
                autoFocus
                autoComplete="current-password"
                required
                className={`w-full pl-3.5 pr-11 py-3 rounded-2xl text-sm font-mono placeholder:text-slate-400 focus:outline-none transition-all ${
                  error
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-2 border-rose-500 text-rose-900 dark:text-rose-100 ring-4 ring-rose-500/10 dark:ring-rose-500/20 shadow-sm shadow-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors cursor-pointer ${
                  error
                    ? 'text-rose-400 hover:text-rose-600 dark:hover:text-rose-300'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </motion.div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isVerifying ? 'Authenticating...' : 'Unlock Payment Dashboard'}</span>
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Student Dashboard</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
