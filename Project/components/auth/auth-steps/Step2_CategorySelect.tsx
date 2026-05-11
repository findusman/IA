// components/auth/steps/Step2_CategorySelect.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "../constants";
import type { AuthModalStepProps } from "@/types";

export default function Step2CategorySelect({
  selectedCategory,
  setSelectedCategory,
  handleNext,
  handleBack,
}: AuthModalStepProps) {
  const handleCategorySelect = (categoryId: "it" | "finance") => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-2">
        Tell us about your world
      </h2>
      <p className="text-white/60 mb-8 text-sm">
        Choose your professional domain to personalize your AI-powered
        experience
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {Object.values(CATEGORIES).map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() =>
                handleCategorySelect(category.id as "it" | "finance")
              }
              className={`
                group relative p-7 cursor-pointer rounded-3xl border-2 transition-all duration-300 backdrop-blur-xl
                ${
                  isSelected
                    ? "border-cyan-400 bg-linear-to-br from-cyan-500/15 to-emerald-500/15 shadow-xl shadow-cyan-500/25 scale-[1.02]"
                    : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:shadow-lg hover:scale-[1.015]"
                }
              `}
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${
                      isSelected
                        ? "bg-linear-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-600/50"
                        : "bg-white/10 group-hover:bg-linear-to-br group-hover:from-cyan-500/30 group-hover:to-emerald-500/30"
                    }
                  `}
                >
                  <Icon
                    className={`w-10 h-10 transition-colors ${
                      isSelected
                        ? "text-white"
                        : "text-white/70 group-hover:text-white"
                    }`}
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/60 text-sm">{category.subtitle}</p>
                </div>
              </div>

              {/* Subtle selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-linear-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 border-2 border-white/30">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="
            flex-1 bg-white/5 backdrop-blur-xl border cursor-pointer border-white/15 
            hover:bg-white/10 text-white font-medium py-4 px-6 rounded-2xl 
            transition-all flex items-center justify-center gap-2
          "
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedCategory}
          className="
            flex-1 cursor-pointer bg-linear-to-r from-cyan-600 to-emerald-600 
            hover:from-cyan-500 hover:to-emerald-500 
            disabled:opacity-40 disabled:cursor-not-allowed 
            disabled:from-white/5 disabled:to-white/5
            text-white font-semibold py-4 px-6 rounded-2xl 
            transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30
            disabled:border disabled:border-white/10
          "
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-white/60 mt-6 text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => {
            // You might want to add logic here to switch to login mode
            // and possibly go back to step 1
          }}
          className="text-cyan-300 cursor-pointer hover:text-cyan-200 font-medium transition-colors"
        >
          Login instead
        </button>
      </p>
    </div>
  );
}
