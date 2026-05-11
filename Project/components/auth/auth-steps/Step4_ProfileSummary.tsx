// components/auth/steps/Step4_ProfileSummary.tsx
"use client";

import { Brain, Sparkles, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "../constants";
import type { AuthModalStepProps } from "@/types";

export default function Step4ProfileSummary({
  selectedCategory,
  selectedRoles,
  selectedSkills,
  name,
  isSignUp,
  isLoading,
  handleBack,
  handleFinalize,
}: AuthModalStepProps & {
  handleFinalize: () => Promise<void>;
}) {
  const router = useRouter();

  if (!selectedCategory) return null;

  const categoryData = CATEGORIES[selectedCategory];

  const handleLaunch = async () => {
    try {
      await handleFinalize();
      // Navigate to Connectors after successful onboarding
      router.push("/dashboard/connectors");
    } catch (error) {
      console.error("Error finalizing onboarding:", error);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-5 bg-linear-to-br from-cyan-500 via-emerald-500 to-teal-600 rounded-full shadow-2xl shadow-cyan-500/40 animate-pulse-slow">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Your Profectia Profile is Ready!
        </h2>
        <p className="text-white/70 text-lg max-w-lg mx-auto">
          {isSignUp && name ? `Welcome, ${name.split(" ")[0]}! ` : ""}
          Review your selections and launch your personalized AI workspace
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-5 mb-10">
        {/* Domain */}
        <div className="bg-linear-to-br from-slate-900/40 to-slate-800/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
            Professional Domain
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <categoryData.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {categoryData.name}
              </p>
              <p className="text-white/60 text-sm">{categoryData.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="bg-linear-to-br from-slate-900/40 to-slate-800/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-3">
            Selected Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.length === 0 ? (
              <p className="text-white/50 text-sm">No roles selected</p>
            ) : (
              selectedRoles.map((role) => (
                <span
                  key={role}
                  className="bg-cyan-900/30 border border-cyan-500/30 text-cyan-100 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {role}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-linear-to-br from-slate-900/40 to-slate-800/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3">
            Key Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.length === 0 ? (
              <p className="text-white/50 text-sm">No skills selected</p>
            ) : (
              selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-100 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Processing Animation */}
      <div className="bg-linear-to-r from-cyan-900/20 via-emerald-900/20 to-cyan-900/20 border border-cyan-500/20 rounded-2xl overflow-hidden mb-8">
        <div className="h-1.5 bg-linear-to-r from-cyan-500 via-emerald-500 to-cyan-400 animate-linear-x"></div>
        <div className="py-5 px-6 flex items-center justify-center gap-3 text-white/80">
          <Brain className="w-6 h-6 animate-pulse" />
          <span className="font-medium">
            Building your personalized AI context...
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleLaunch}
          disabled={isLoading}
          className={`
            w-full py-5 px-8 rounded-2xl cursor-pointer font-bold text-lg transition-all transform
            ${
              isLoading
                ? "bg-slate-700 cursor-wait opacity-70"
                : "bg-linear-to-r from-cyan-600 via-emerald-600 to-teal-600 hover:from-cyan-500 hover:via-emerald-500 hover:to-teal-500 shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-[1.02]"
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Launching...
            </span>
          ) : (
            "🚀 Launch My Mission Control"
          )}
        </button>

        <button
          onClick={handleBack}
          className="
            w-full bg-white/5 border cursor-pointer border-white/15 hover:bg-white/10 
            text-white font-medium py-4 px-6 rounded-2xl transition-all 
            flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} />
          Back to Edit
        </button>
      </div>
    </div>
  );
}
