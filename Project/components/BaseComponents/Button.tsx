"use client";

import React, { forwardRef } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "alert"
  | "success"
  | "info"
  | "neutral";

type Size = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-md",
  lg: "px-6 py-3 text-lg rounded-md",
};

const variantClasses: Record<Variant, string> = {
  primary: "btnGradintPrimary",
  secondary: "btnGradintSecondary",
  danger: "btnGradintDanger",
  alert: "btnGradintAlert",
  success: "btnGradintSuccess",
  info: "btnGradintInfo",
  neutral:
    "bg-white/10 hover:bg-white/20 text-white border border-white/20 focus:ring-white/40",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const composedClasses = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth && "w-full",
      className,
    );

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={composedClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
