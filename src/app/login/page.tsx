"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Section: Visual Brand Anchor (Desktop Only) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent blur-[120px]"></div>
          <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-white blur-[100px]"></div>
          <div 
            className="absolute inset-0" 
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "40px 40px" }}
          ></div>
        </div>
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-xl">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold tracking-tight">Cashcrow Lab</span>
            <span className="text-accent/80 text-xs font-medium uppercase tracking-widest">Protoform Technologies</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-white text-5xl font-bold leading-tight mb-6">
            Precision Inventory <br/>for Modern Science.
          </h2>
          <p className="text-accent/70 text-lg font-normal leading-relaxed">
            Streamline your research workflow with our advanced asset tracking system. Secure, scalable, and built for the next generation of lab management.
          </p>
        </div>

        {/* Trust Badge */}
        <div className="relative z-10 glass-effect p-6 rounded-xl inline-flex items-center gap-4 max-w-fit">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCs7gxV98B8Yg6YC-jqN-8xM-VSjFjKv4rgl2A290VHZgbfPq9xkrt5vRBA5tbD6JqrNxL0Hsmxnr2wQO9G6ImM44GRBZ7oEIuFS6ufnVLVf2WOC4F23yYeQQN9kCMnMf3Ganix5Xk6BEPYOc53qhRMJ5hDAeSkkaEP68S7PXrKUjSQpPv4jJfOGs8jq1EmVyZMiF-SzZgZhmSE8Xo7dq64ALV3-jr5eDyiYytJzOzq6h5W09Ou2gh1mxSMJAfNi7GxRPVmPf_cO8w')" }}></div>
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDGmJRiS05U2vwgJQOI__LMC-CKtTbNHZ22me7dkhnPztNYoWtjSQAThx0bWxWz9bDEDdjxaMhYlovBnhKqnZyKYIpgZIpcfKJxzeQylCk0geHl5ITUjxg5OgQcrh6GXKjOSRrYBDhhKN3hypOkfqWtesg3AJ5MN1m6MyTjvbtovI52FFXwCcBBWU-UFNLuXFipAdONUAKucA_FL7vffS5WHrS4-8nulTVKVi6WLFm8vMgFWmepKWJbT-ixpdtNVpzFv_GCf-xD77c')" }}></div>
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD96BE6Afm15Qg9buqTfgCPeGFTRdt0l27o3ZmYN6-QMkslpf4pppnnSkxgTJRueu7WoE9Ky_xKrQW9Vcgj-4QWrvXAokCtJYU63SabcbDSKUNpro0-_-ExC2a8f5cUh_LvFnmX-Bzu-_By9o57dBifgG4nTIUPh4oR6BhKln3G-fvtdSGfKi9q3nF-TybgGtJGKbjyO4rM9aYVGNraRhPrx3g1xo_jCwYnVE8zy45C6agNUq9EGRMQIqcD61hPNIoxOYO_ZicuqIE')" }}></div>
          </div>
          <p className="text-white text-sm font-medium">Trusted by 500+ research facilities globally</p>
        </div>
      </div>

      {/* Right Section: Authentication Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[440px]">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="bg-primary p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight">Cashcrow Lab</h2>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold mb-2">Welcome back to the Lab</h1>
            <p className="text-muted-text dark:text-slate-400">Please enter your credentials to access your dashboard.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold block px-1" htmlFor="email">Email address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-muted-text/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" 
                  id="email" 
                  placeholder="name@protoform.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="password">Password</label>
                <Link className="text-primary hover:text-primary-light text-sm font-semibold transition-colors" href="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg py-4 pl-12 pr-12 text-slate-900 dark:text-slate-100 placeholder:text-muted-text/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 px-1">
              <input 
                className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" 
                id="remember" 
                type="checkbox"
              />
              <label className="text-sm font-medium text-muted-text dark:text-slate-400 cursor-pointer" htmlFor="remember">Remember this device for 30 days</label>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* SSO Option */}
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="h-[1px] bg-slate-200 dark:bg-slate-700 flex-1"></div>
              <span className="text-xs uppercase font-bold tracking-widest text-muted-text/60">Other Options</span>
              <div className="h-[1px] bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-sm font-semibold">Sign in with Single Sign-On</span>
            </button>
<p className="text-sm text-muted-text dark:text-slate-500 text-center">
              Don&apos;t have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center">
            <p className="text-[11px] uppercase tracking-widest text-muted-text/50 font-bold">
              Powered by Protoform Systems
            </p>
            <div className="mt-4 flex justify-center gap-6 text-xs text-muted-text/40">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">System Status</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
