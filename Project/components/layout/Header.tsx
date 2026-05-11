"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import NotificationDropdown from "@/components/GenericComponents/NotificationDropdown";
import ProfileDropdown from "@/components/GenericComponents/ProfileDropdown";

type HeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
};

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const pathname = usePathname();

  const activeMenu = useMemo(() => {
    // Extract the page name from pathname
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length < 2) return "Dashboard";

    const pageName = segments[segments.length - 1];
    // Convert kebab-case to Title Case
    return pageName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [pathname]);

  return (
    <header className="h-15 bg-light-surface dark:bg-dark-surface backdrop-blur-xl border-b border-light-border dark:border-dark-border flex items-center justify-between px-6 transition-colors relative z-40">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-7 h-7 rounded-full cursor-pointer bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        )}
        <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary capitalize">
          {activeMenu}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
