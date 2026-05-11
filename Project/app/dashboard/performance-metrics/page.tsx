"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, Info, Flag } from "lucide-react";
import PerformanceMetrics from "@/components/DashboardRoutesComponets/PerformanceMetrics/PerformanceMetrics";
import DashboardCrads from "@/components/DashboardRoutesComponets/ActionFeedComponents/DashboardCrads";
import {
  backgroundAreaData,
  pieData,
  performanceRelaysData,
  efficiencyMetricsData,
  comparativeData,
  milestone,
} from "@/data/ChartsData";

const GrowthVelocityScore = () => {
  const velocityScore = 78;
  const wowChange = "+5.4%";
  const comparison = "Vs. UK SaaS Startups: Ahead of 90%";
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0e14] via-[#0f1419] to-[#0a0e14] text-white p-8">
      <div className="max-w-350 mx-auto">
        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-linear-to-br from-[#0d1117]/80 via-[#161b22]/80 to-[#0d1117]/80 backdrop-blur-xl border-2 border-cyan-500/40 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20 relative overflow-hidden"
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8">
              <div className="">
                <h1 className="text-3xl font-bold text-cyan-400">
                  Growth Velocity Score
                </h1>
                <p className="text-slate-400">
                  Comprehensive performance overview
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 cursor-pointer bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-sm transition-all"
                >
                  View Calculation
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 cursor-pointer bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-sm transition-all"
                >
                  Logic
                </motion.button>
              </div>
            </div>

            {/* Main Score Display */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mb-8 overflow-hidden rounded-xl bg-[#0B1220] h-80 group"
            >
              {/* Background Area Graph - Positioned absolutely */}
              <PerformanceMetrics backgroundAreaData={backgroundAreaData} />

              {/* Foreground Content - Overlaying the chart */}
              <div className="relative z-50 h-full flex items-center justify-between px-8 py-6">
                <div className="flex items-end gap-6 mb-10">
                  <div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="text-8xl font-bold text-green-400 leading-none"
                    >
                      {velocityScore}
                    </motion.div>
                    <div className="text-slate-400 text-lg mt-2">
                      Velocity Index
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2 mb-2 justify-end"
                  >
                    <span className="text-green-400 text-lg font-semibold">
                      {wowChange} WoW Change
                    </span>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </motion.div>

                  <div className="text-slate-400 text-sm flex items-center gap-2 justify-end">
                    {comparison}
                    <div className="w-5 h-5 bg-slate-700 rounded flex items-center justify-center">
                      <Info className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Multi-Source Efficiency Ratios Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-6">
                Multi-Source Efficiency Ratios
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Metrics */}
                <div className="lg:col-span-4">
                  <DashboardCrads efficiencyMetrics={efficiencyMetricsData} />
                </div>

                {/* Center - Doughnut Chart */}
                <PerformanceMetrics pieData={pieData} />

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Comparative Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-linear-to-br from-blue-950/40 to-blue-900/20 border border-blue-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold">
                        {comparativeData.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                        Ahead
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {comparativeData.subtitle}
                    </p>
                  </motion.div>

                  {/* Current Performance Relays Chart */}
                  <PerformanceMetrics
                    performanceRelaysData={performanceRelaysData}
                  />

                  {/* Alert Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                    className="bg-linear-to-br from-red-950/40 to-red-900/20 border border-red-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold mb-1">
                          What&apos;s Holding You Back?
                        </h3>
                        <p className="text-xs text-slate-400">
                          Deployment bottlenecks in Repo-4 are slowing of the
                          12%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Milestone Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Milestone Tracker</h2>

              <div className="bg-[#1a1f2e]/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Flag className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{milestone.title}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">
                          All Schwinefield Andres and Month
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-all"
                  >
                    Set New Goal
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {milestone.progress}%
                    </div>
                    <div className="text-sm text-slate-400">
                      {milestone.status}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-green-400 font-semibold">
                        {milestone.status}
                      </span>
                      <div className="flex items-center gap-4 text-slate-400">
                        <span>{milestone.estimate}</span>
                        <span>{milestone.actual}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{
                          duration: 1.5,
                          delay: 1.6,
                          ease: "easeOut",
                        }}
                        className="h-full bg-linear-to-r from-blue-500 to-cyan-400 rounded-full relative"
                      >
                        {/* Animated shimmer */}
                        <motion.div
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GrowthVelocityScore;
