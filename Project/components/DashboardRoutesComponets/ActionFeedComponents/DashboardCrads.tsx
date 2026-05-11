import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Flag,
  Bookmark,
  Cloud,
  Network,
  Settings,
  Lock,
} from "lucide-react";
import { DashboardCradsProps } from "@/types";

const DashboardCrads = ({
  actionItems,
  efficiencyMetrics,
  upvoteCards,
  dataDiagramCards,
  appNameDropdownConfig,
}: DashboardCradsProps) => {
  // Render app name dropdown
  if (appNameDropdownConfig) {
    return (
      <div className="w-full mb-6">
        <h2 className="text-xl font-semibold mb-6">
          Custom Webhook / API Power Builder
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">App Name</label>
          <div className="flex items-center justify-between bg-[#2b323c]/50 border border-slate-600 rounded-lg px-4 py-2">
            <span>{appNameDropdownConfig.selectedApp}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                appNameDropdownConfig.setApiIntegration(
                  !appNameDropdownConfig.apiIntegration,
                )
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                appNameDropdownConfig.apiIntegration
                  ? "bg-blue-500"
                  : "bg-slate-600"
              }`}
            >
              <motion.div
                animate={{ x: appNameDropdownConfig.apiIntegration ? 24 : 2 }}
                className="w-5 h-5 bg-white rounded-full"
              />
            </motion.button>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          Integrate any with our API
        </p>

        {/* Endpoint URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Endpoint URL</label>
          <input
            type="text"
            placeholder="Auth Header"
            className="w-full bg-[#2b323c]/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Auth Header Optional */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Auth Header (Optional)"
            className="w-full bg-[#2b323c]/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Badges & Direct Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Badges & Direct</label>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                appNameDropdownConfig.setBadgesDirect(
                  !appNameDropdownConfig.badgesDirect,
                )
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                appNameDropdownConfig.badgesDirect
                  ? "bg-blue-500"
                  : "bg-slate-600"
              }`}
            >
              <motion.div
                animate={{ x: appNameDropdownConfig.badgesDirect ? 24 : 2 }}
                className="w-5 h-5 bg-white rounded-full"
              />
            </motion.button>
          </div>
          <input
            type="text"
            placeholder="Payload Mapping 6 Galler [CSM]"
            className="w-full bg-[#2b323c]/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    );
  }

  // Render data diagram cards
  if (dataDiagramCards && dataDiagramCards.length > 0) {
    const getIcon = (iconType: string) => {
      switch (iconType) {
        case "Cloud":
          return <Cloud className="w-14 h-14 mx-auto relative z-10" />;
        case "Network":
          return <Network className="w-14 h-14 mx-auto relative z-10" />;
        case "Settings":
          return <Settings className="w-14 h-14 mx-auto relative z-10" />;
        default:
          return null;
      }
    };

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {dataDiagramCards.map((card, index) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl p-8 mb-3 shadow-lg ${card.shadowColor} transition-all relative overflow-hidden group`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className={`${card.iconColor}`}>{getIcon(card.icon)}</div>
                <div
                  className={`absolute top-2 right-2 w-2 h-2 bg-gradient-to-r ${card.iconColor.replace("text-", "from-").replace("-", "-400 to-")} rounded-full animate-pulse`}
                  style={{ animationDelay: card.pulseDelay }}
                />
              </motion.div>
              <div className="text-base font-semibold">{card.title}</div>
              <div className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
                {card.description}
                {card.hasLockIcon && <Lock className="w-3 h-3" />}
              </div>
              <div
                className={`mt-2 inline-block px-3 py-1 ${card.badgeBg} border ${card.badgeBorder} rounded-full text-xs ${card.badgeText}`}
              >
                {card.badge}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Flow Indicators */}
        <div className="md:hidden flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 self-center" />
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 self-center" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
    );
  }

  // Render upvote cards
  if (upvoteCards && upvoteCards.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {upvoteCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-[#2b323c] rounded-xl p-4 border border-slate-600 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}
              >
                {/* HataDog → Show "HD" text */}
                {card.name === "HataDog" ? (
                  <span className="text-sm font-bold text-white tracking-wide">
                    HD
                  </span>
                ) : typeof card.icon === "string" ? (
                  /* DataDog → Larger icon size */
                  <Image
                    src={card.icon}
                    alt={card.name}
                    width={card.name === "DataDog" ? 55 : 30}
                    height={card.name === "DataDog" ? 55 : 30}
                    className="object-contain"
                  />
                ) : (
                  <div className="h-6 w-6 text-white">{card.icon}</div>
                )}
              </div>

              <span className="font-semibold">{card.name}</span>
            </div>

            <div className="text-xs text-slate-400 mb-2">{card.status}</div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{card.votes}</span>
              <span className="text-xs text-slate-400">Votes</span>
            </div>

            <div className="w-full bg-[#404953] rounded-full h-1.5 mt-3 mb-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: card.progress.replace("w-[", "").replace("%]", "%"),
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-1.5 rounded-full ${card.progressColor}`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-3 bg-[#404953] hover:bg-slate-500 py-2 rounded-lg text-sm transition-colors"
            >
              {card.status === "New Request" ? "New Request" : "Status"}
            </motion.button>
          </motion.div>
        ))}
      </div>
    );
  }

  if (actionItems && actionItems.length > 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {actionItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay }}
            className={`bg-[#0f172a]/50 ${
              item.hasRedBorder
                ? "border border-red-500/50 shadow-lg shadow-red-500/10"
                : "border border-slate-800"
            } rounded-xl p-5 relative overflow-hidden`}
          >
            {/* Top & Bottom Accent Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

            {/* Side Glow Effects */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

            {/* Alert Icon */}
            {item.hasAlert && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
              </div>
            )}

            {/* Title with Icon */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                <Flag className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-semibold text-base">{item.title}</h3>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {item.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded-lg transition-colors">
                Approve
              </button>
              <button className="flex-1 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded-lg transition-colors">
                Delegate to Jira
              </button>
              <button className="flex-1 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded-lg transition-colors">
                Ignore
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Render efficiency metrics
  if (efficiencyMetrics && efficiencyMetrics.length > 0) {
    return (
      <div className="space-y-6">
        {efficiencyMetrics.map((metric, index) => {
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="relative group bg-[#0f172a] border border-slate-800 rounded-2xl p-5 transition-all cursor-pointer"
            >
              {/* Top & Bottom Accent Lines */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

              {/* Side Glow Effects */}
              <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

              {/* Header Section */}
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  {metric.title}
                </h3>
                {/* Status Icon */}
                {index === 0 ? (
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                ) : (
                  <Bookmark className="w-5 h-5 text-red-500 fill-red-500" />
                )}
              </div>

              {/* Value Section */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    {metric.value}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {metric.subtitle}
                  </span>
                </div>
              </div>

              {/* Footer Section: Logos & Deep Dive */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Badge Logos */}
                  <div className="flex -space-x-1">
                    {metric.badges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400 uppercase"
                      >
                        {badge.substring(0, 1)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {metric.badges.join(" ")}
                  </span>
                </div>

                {/* Action Button or Icon */}
                {metric.id === "3" ? (
                  <button className="px-4 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded-lg transition-colors">
                    Deep Dive
                  </button>
                ) : (
                  <Bookmark className="w-5 h-5 text-red-500 fill-red-500" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return null;
};

export default DashboardCrads;
