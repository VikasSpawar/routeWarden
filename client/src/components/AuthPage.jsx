import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Layout, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import clsx from 'clsx';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;
      // If successful, App.jsx listener handles the redirect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0C10] text-slate-200 font-sans overflow-hidden">
      
      {/* LEFT PANEL (Branding) */}
      <div className="hidden md:flex relative w-1/2 bg-[#111111] flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Abstract Background Effect */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0B0C10] to-[#0B0C10]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="z-10 flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/20">
            <Layout className="text-blue-500" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">RouteWarden</span>
        </div>

        <div className="z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl font-black leading-tight text-white tracking-tight">
            Manage your APIs with <span className="text-blue-500">Precision</span>.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Streamline your development workflow with the most intuitive, Zen-mode API collection manager built for modern developers.
          </p>
        </div>

        <div className="z-10 text-xs text-slate-600 font-mono">
          © 2025 RouteWarden Inc.
        </div>
      </div>

      {/* RIGHT PANEL (Form) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:px-8 relative bg-[#0B0C10]">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {isLogin ? 'Enter your credentials to access your workspace.' : 'Get started with your free developer account.'}
            </p>
          </div>

          {/* TOGGLE SWITCH */}
          <div className="flex p-1 bg-[#171717] rounded-xl border border-white/5">
            <button
              onClick={() => setIsLogin(true)}
              className={clsx(
                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                isLogin ? "bg-[#262626] text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={clsx(
                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                !isLogin ? "bg-[#262626] text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-4">
              
              {/* EMAIL INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-[#171717] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-[#171717] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 flex-shrink text-xs text-slate-500 font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* SOCIAL AUTH */}
          <button 
            type="button"
            disabled={true}
            onClick={handleGoogleLogin} // Note: Needs Google Auth configured in Supabase to work
            className="w-full cursor-not-allowed  flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-200 py-3.5 rounded-xl font-bold transition-colors"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
             </svg>
             <span>Sign in with Google</span>
          </button>

        </div>
      </div>
    </div>
  );
}