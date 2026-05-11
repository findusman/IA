// components/ui/GenericModal.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  stepInfoClassName?: string;
  stepInfo?: {
    current: number;
    total: number;
  };
}

export default function GenericModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  maxWidth = "max-w-2xl",
  className = "",
  headerClassName = "",
  contentClassName = "",
  stepInfoClassName = "",
  stepInfo,
}: GenericModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ willChange: "opacity" }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ willChange: "opacity" }}
      />

      {/* Modal Content */}
      <motion.div
        className={`w-full ${maxWidth} relative z-10 ${className}`}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="bg-[#0B1220]/95 rounded-3xl shadow-2xl border border-white/10 overflow-hidden max-h-[89vh] flex flex-col">
          {/* Header */}
          {(title || stepInfo || showCloseButton) && (
            <div
              className={`bg-linear-to-br from-cyan-500/15 via-purple-500/10 to-pink-500/5 border-b border-white/20 shrink-0 backdrop-blur-lg ${headerClassName}`}
            >
              {/* Decorative gradient line at top */}
              <div className="h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent" />

              {/* Title and Subtitle Section */}
              <div className="px-8 pt-6 flex items-start justify-between gap-4 relative">
                <div className="flex-1">
                  {title && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3"
                    >
                      <h1 className="text-3xl font-bold bg-linear-to-r from-white via-cyan-100 to-emerald-100 bg-clip-text text-transparent leading-tight drop-shadow-lg">
                        {title}
                      </h1>
                    </motion.div>
                  )}
                  {/* {subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-sm text-cyan-100/80 font-medium"
                    >
                      {subtitle}
                    </motion.p>
                  )} */}
                </div>

                {/* Close Button */}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    aria-label="Close"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-full cursor-pointer bg-linear-to-br from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-white/70 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shrink-0 border border-white/10 hover:border-cyan-400/30 absolute top-2 right-2"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Step Indicator - Left Bottom */}
              {stepInfo && (
                <div
                  className={`px-2 pb-2 flex items-center gap-3 ${stepInfoClassName}`}
                >
                  <div className="flex flex-row items-baseline gap-2">
                    <span className="text-base font-medium text-white">
                      Step {stepInfo.current}
                    </span>
                    <span className="text-xs text-white/60 ">
                      of {stepInfo.total}
                    </span>
                  </div>
                </div>
              )}

              {/* Progress Bar - Full Width Bottom */}
              {stepInfo && (
                <div className="h-1 bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 shadow-lg shadow-cyan-500/50"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${(stepInfo.current / stepInfo.total) * 100}%`,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div
            className={`flex-1 overflow-y-auto custom-scrollbar ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
