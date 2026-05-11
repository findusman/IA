import type { ReactNode } from "react";

interface BaseCardWrapperProps {
  children: ReactNode;
  className?: string;
  paddingDisabled?: boolean;
}

const BaseCardWrapper = ({
  children,
  className,
  paddingDisabled,
}: BaseCardWrapperProps) => {
  const base = [
    "rounded-xl",
    // Surface colors from your design tokens
    "bg-light-surface/60 dark:bg-dark-surface/60",
    // Soft border/ring for better glass depth
    "border border-light-border ",
    // iOS-style glass effect
    // 'backdrop-blur-lg saturate-150',
    "shadow-sm",
    // Layout
    paddingDisabled ? "p-0" : "p-5",
    "flex items-center gap-4",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={[base, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
};

export default BaseCardWrapper;
