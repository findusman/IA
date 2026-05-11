// components/auth/steps/Step1_Introduction.tsx
"use client";

import { ChevronRight } from "lucide-react";
import { AuthModalStepProps } from "@/types";

export default function Step1Introduction({
  isSignUp,
  setIsSignUp,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  handleEmailAuth,
  handleSocialLogin,
  isLoading,
  error,
}: AuthModalStepProps & {
  handleEmailAuth: () => void;
  handleSocialLogin: (provider: "google" | "facebook") => void;
}) {
  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isSignUp ? "Join Profectia AI" : "Welcome Back"}
        </h2>
        <p className="text-white/60">
          {isSignUp
            ? "Create your account to get started with AI-powered insights"
            : "Sign in to your account to continue"}
        </p>
      </div>

      <div className="space-y-5">
        {/* Social Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            className="w-full bg-white/95 cursor-pointer hover:bg-white backdrop-blur-xl text-gray-900 font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] border border-white/20 disabled:opacity-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z"
                fill="#4285F4"
              />
              <path
                d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9465L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z"
                fill="#34A853"
              />
              <path
                d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z"
                fill="#FBBC05"
              />
              <path
                d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z"
                fill="#EB4335"
              />
            </svg>
            <span>{isSignUp ? "Sign up" : "Continue"} with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin("facebook")}
            disabled={isLoading}
            className="w-full bg-linear-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z"
                fill="white"
              />
            </svg>
            <span>{isSignUp ? "Sign up" : "Continue"} with Facebook</span>
          </button>
        </div>

        <div className="relative my-6 flex items-center justify-center gap-5">
          <div className="w-full border-t border-white/20"></div>
          <div className="bg-linear-to-r from-cyan-600 via-emerald-600 to-slate-700 hover:from-cyan-500 hover:via-emerald-500 hover:to-slate-600 text-white text-nowrap backdrop-blur-xl px-3 py-0.5 overflow-hidden rounded-full text-sm font-medium min-w-40 text-center">
            Or {isSignUp ? "Join" : "Sign in"} with email
          </div>
          <div className="w-full border-t border-white/20"></div>
        </div>

        {/* Email / Password Fields */}
        <div className="space-y-3">
          {isSignUp && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>

        <button
          onClick={handleEmailAuth}
          disabled={isLoading || !email || !password || (isSignUp && !name)}
          className="w-full bg-linear-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-5 h-5  gap-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="flex items-center gap-1 ">
              <p className="">{isSignUp ? "Join Profectia" : "Sign In"}</p>
              <ChevronRight className="w-5 h-5 mt-0.5" />
            </div>
          )}
        </button>

        <p className="text-center text-white/60 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setName("");
              setEmail("");
              setPassword("");
            }}
            className="text-cyan-300 cursor-pointer hover:text-cyan-200 font-semibold transition-colors"
            disabled={isLoading}
          >
            {isSignUp ? "Sign In" : "Join Now"}
          </button>
        </p>
      </div>
    </div>
  );
}
