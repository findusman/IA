import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggler: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-10 h-10 rounded-full bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80 flex items-center justify-center transition-all duration-200 hover:scale-110"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
};

export default ThemeToggler;
