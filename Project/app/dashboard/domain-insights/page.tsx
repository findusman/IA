"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import DomainInsights from "@/components/DashboardRoutesComponets/DomainInsights/DomainInsights";

import {
  metricCards,
  technicalDebtData,
  domains,
  heatmapData,
  connectors,
} from "@/data/ChartsData";

const EngineeringTelemetry = () => {
  const [activeDomain, setActiveDomain] = useState("Engineering");
  const [feedback, setFeedback] = useState("");

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] text-white p-6">
      <div className="max-w-400 mx-auto">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            {domains.map((domain, index) => (
              <motion.button
                key={domain.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveDomain(domain.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeDomain === domain.name
                    ? "bg-[#2a3441] border border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "bg-[#1e2530] border border-slate-700 hover:border-slate-600"
                }`}
              >
                <span className="text-lg">{domain.icon}</span>
                <span className="font-medium">{domain.name}</span>
                {activeDomain === domain.name && (
                  <motion.div
                    layoutId="activeDot"
                    className="w-2 h-2 rounded-full bg-green-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-[#3483eb] cursor-pointer hover:bg-blue-700 rounded-lg font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            Compare Domains
          </motion.button>
        </motion.div>

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-cyan-400 mb-8"
        >
          Engineering Telemetry
        </motion.h1>

        {/* Main Grid Layout */}
        <div className="flex flex-col gap-6">
          {/* Top Metric Cards */}
          <DomainInsights metricCards={metricCards} />
          {/* Connectors Section */}
          <div className="w-full items-start justify-center gap-3 flex mb-4">
            {/* Left Sidebar - Connectors */}

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-12 lg:col-span-2 bg-[#1a1f2e]/50 backdrop-blur border border-slate-700/50 rounded-xl p-5 max-w-75"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#3483eb] rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">E</span>
                  </div>
                  <div>
                    <div className="font-semibold">Enoleeue</div>
                    <div className="text-xs text-slate-400">
                      Nextaction Labs.com
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-400 mb-3">
                  Active Connectors for this Domain
                </div>

                <div className="space-y-2">
                  {connectors.map((connector, index) => (
                    <motion.button
                      key={connector.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                        connector.active
                          ? "bg-blue-600/20 border border-blue-500/30"
                          : "bg-[#252b38] border border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                          {typeof connector.icon === "string" ? (
                            <Image
                              src={connector.icon}
                              alt={connector.name}
                              width={18}
                              height={18}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-white">{connector.icon}</span>
                          )}
                        </div>

                        <span className="text-sm font-medium">
                          {connector.name}
                        </span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-10 space-y-6 flex-1">
              {/* Bottleneck Identification - Critical Alert */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="lg:col-span-2">
                  <div className="bg-linear-to-br from-red-950/50 to-red-900/30 border-2 border-red-500/50 rounded-xl p-6 shadow-2xl shadow-red-500/20 relative overflow-hidden">
                    {/* Animated background pulse */}
                    <motion.div
                      className="absolute inset-0 bg-red-500/5"
                      animate={{
                        opacity: [0.05, 0.1, 0.05],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h2 className="text-lg font-bold">
                              Bottleneck Identification
                            </h2>
                          </div>
                          <div className="text-xl font-bold text-red-400 mb-3">
                            Current Blocker: Code Review Latency
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">
                            Data Evidence:
                          </div>
                          <div className="text-white">
                            5 PRs stuck in "Pending Review" for &gt;72 hours
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-slate-400 mb-1">
                            Impact on Goal:
                          </div>
                          <div className="text-white">
                            Delays "Project Alpha" by 4 days
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-[#3483eb] cursor-pointer hover:bg-blue-700 rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all"
                      >
                        Unblock
                        <TrendingUp className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                {/* Technical Debt Index */}
                <DomainInsights technicalDebtData={technicalDebtData} />
              </motion.div>

              {/* Resource Allocation Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-[#1a1f2e]/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Resource Allocation Map
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Jira</span>
                  </div>
                </div>

                {/* Treemap Visualization */}
                <div className="relative bg-[#0f1419] rounded-xl p-6 overflow-hidden">
                  <DomainInsights heatmapData={heatmapData} />
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full sm:w-auto px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  Rebalance Resources
                  <span className="text-blue-400">📊</span>
                </motion.button>
              </motion.div>

              {/* Feedback Loop */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-[#1a1f2e]/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Feedback Loop</h3>
                <div className="text-sm text-slate-400 mb-4">
                  Recommend for this pag...
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-[#252b38] hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-[#252b38] hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </motion.button>

                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add your feedback..."
                    className="flex-1 bg-[#252b38] border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-[#3483eb] hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-slate-400"
          >
            <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <span className="text-xs font-bold">💡</span>
            </div>
            <span className="text-sm">Powered by Profectia.ai</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringTelemetry;
