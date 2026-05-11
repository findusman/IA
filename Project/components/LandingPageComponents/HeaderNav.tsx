"use client";

import React from "react";
// import ThemeToggler from "@/components/GenericComponents/ThemeToggler";
import { Brain, ArrowRight } from "lucide-react";

type Section = { id: string; label: string };

interface HeaderNavProps {
  sections: Section[];
  activeSection?: string;
  onSignUp: () => void;
}

const HeaderNav: React.FC<HeaderNavProps> = ({
  sections,
  activeSection,
  onSignUp,
}) => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed w-full bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md shadow-sm z-50 border-b border-light-border dark:border-dark-border transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="LandingPageBtnWithGrdient bg-clip-text text-transparent cursor-pointer flex items-center gap-2">
          <Brain className="w-8 h-8 text-purple-600 to-cyan-600" />
          <span className="text-2xl font-bold">Profectia.ai</span>
        </div>

        <div className="hidden md:flex gap-8">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleNavClick(e, id)}
              aria-current={activeSection === id ? "page" : undefined}
              className={`text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-purple-600 to-cyan-600 transition ${
                activeSection === id
                  ? "font-semibold text-light-primary dark:text-purple-400"
                  : ""
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {/* login button */}
          <button
            onClick={onSignUp}
            className="relative cursor-pointer group px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />

            {/* Button content */}
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:left-full transition-all duration-500" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
