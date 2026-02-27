"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName, role);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("Registration successful! Please check your email to confirm your account.");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
      {/* Left Side: Brand Panel */}
      <div className="relative hidden lg:flex flex-col w-[40%] bg-primary p-12 text-white items-center text-center justify-start pt-24">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>

        <div className="relative z-10">
          <div className="flex gap-3 mb-12 flex-col items-center">
            <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">biotech</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Cashcrow Lab</h1>
              <p className="text-[10px] uppercase tracking-widest opacity-80">Protoform Technologies</p>
            </div>
          </div>

          <div className="max-w-md space-y-6 mx-auto">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">Empowering Modern Lab Management</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Track lab components with precision, manage inventory seamlessly, and optimize your scientific workflow with our enterprise-grade suite.
            </p>
          </div>
        </div>

        <div className="relative z-10 absolute bottom-12">
          <div className="flex items-center gap-4 text-sm opacity-60 justify-center">
            <span>© 2024 Protoform Technologies Pvt Ltd</span>
            <span className="size-1 bg-white rounded-full"></span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="flex-1 bg-white dark:bg-background-dark flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-8 self-start">
          <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">biotech</span>
          </div>
          <h2 className="text-xl font-bold text-primary">Cashcrow Lab</h2>
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Create your account</h3>
            <p className="text-slate-500 dark:text-slate-400">Join the next generation of lab inventory control.</p>
          </div>

          {/* Error/Success Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="full-name">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100"
                  id="full-name"
                  placeholder="John Doe"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="role">Select Role</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">manage_accounts</span>
                <select
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="admin">Lab Administrator (Full Access)</option>
                  <option value="member">Lab Member (Inventory Access)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="confirm-password">Confirm</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_reset</span>
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100"
                    id="confirm-password"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 py-2">
              <input
                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                id="terms"
                type="checkbox"
                required
              />
              <label className="text-xs text-slate-500 dark:text-slate-400" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-medium" href="#">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-3.5 bg-primary hover:bg-primary-light text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              type="submit"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Already have an account?
              <Link href="/login" className="text-primary font-bold hover:underline ml-1">Log In</Link>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Secure Enterprise Access</span>
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">SSL Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">encrypted</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">AES-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
