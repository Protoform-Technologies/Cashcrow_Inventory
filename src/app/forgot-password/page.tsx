"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Left Panel: Branding */}
      <div className="lg:w-1/2 bg-primary flex flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Decorative Background Pattern */}
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
        <div className="relative z-10 max-w-lg mt-12">
          <h2 className="text-white text-5xl font-bold leading-tight mb-6">
            Secure Password <br/>Recovery.
          </h2>
          <p className="text-accent/70 text-lg font-normal leading-relaxed">
            Recover your account securely. Follow the instructions sent to your email to regain access to your dashboard.
          </p>
        </div>

        {/* Trust Badge */}
        <div className="relative z-10 glass-effect p-4 rounded-xl inline-flex items-center gap-3 max-w-fit mt-8">
          <span className="material-symbols-outlined text-white">lock</span>
          <span className="text-white text-sm font-medium">256-bit SSL Encrypted</span>
        </div>
      </div>

      {/* Right Panel: Recovery Card */}
      <div className="lg:w-1/2 bg-background-light dark:bg-background-dark flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-primary p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight">Cashcrow Lab</h2>
          </div>

          {/* Recovery Form Card */}
          {!showSuccess ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 p-8 sm:p-10 border border-primary/5">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Forgot Password?</h2>
                <p className="text-slate-500 dark:text-slate-400">Enter your email address associated with your account and we'll send you a link to reset your password.</p>
              </div>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors">mail</span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100 placeholder:text-muted-text/50"
                      id="email"
                      name="email"
                      placeholder="name@protoform.com"
                      required
                      type="email"
                    />
                  </div>
                </div>
                <button
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-primary hover:bg-primary-light text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20"
                  type="button"
                  onClick={() => setShowSuccess(true)}
                >
                  Send Reset Link
                </button>
              </form>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors" href="/login">
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            /* Success State Card */
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 p-8 sm:p-10 border border-primary/5 flex flex-col items-center text-center">
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined !text-4xl text-primary">mark_email_read</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Check your inbox</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                We've sent a password reset link to <span className="font-medium text-slate-900 dark:text-slate-200">name@protoform.com</span>. Please check your email to continue.
              </p>
              <div className="space-y-4 w-full">
                <button className="w-full flex items-center justify-center rounded-lg h-12 px-4 bg-primary hover:bg-primary-light text-white text-sm font-bold transition-colors">
                  Open Email App
                </button>
                <p className="text-sm text-slate-500">
                  Didn't receive the email?
                  <button className="text-primary font-bold cursor-pointer hover:underline ml-1" onClick={() => setShowSuccess(false)}>Resend link</button>
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full">
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors" href="/login">
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </div>
          )}
          
          {/* Assistance Note */}
          <div className="mt-8 text-center px-4">
            <p className="text-xs text-muted-text/60 dark:text-slate-500 leading-relaxed">
              Need help accessing your account? Please contact your laboratory administrator or our technical support team at support@protoform.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
