import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { DashboardChartsProps } from "@/types";
const CostCorrelation = ({
  costPerFeatureData,
  devDollarData,
  valueSpendData,
  costHeatmapData,
  costHeatmapLabels,
}: DashboardChartsProps) => {
  const getHeatmapColor = (value: number) => {
    if (value >= 0.8) return "bg-red-500";
    if (value >= 0.6) return "bg-orange-500";
    if (value >= 0.4) return "bg-yellow-500";
    if (value >= 0.2) return "bg-green-400";
    return "bg-emerald-600";
  };

  return (
    <>
      {/* Cost Per Feature Card - Cost Correlation */}
      {costPerFeatureData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d1117]/80 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold mb-2">Cost Per Feature</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">£120</span>
            <span className="text-slate-400 text-sm">/ Feature</span>
          </div>

          <div className="h-32 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costPerFeatureData}>
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  style={{ fontSize: 10 }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1419",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#10b981", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: "#10b981", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">Avg. Last 6 months</div>
            <div className="text-xs text-emerald-400 font-semibold">+5.2%</div>
          </div>
        </motion.div>
      )}

      {/* Dev Dollar Efficiency Card - Cost Correlation */}
      {devDollarData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0d1117]/80 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold mb-2">
            Dev Dollar Efficiency
          </h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">2.5</span>
            <span className="text-slate-400 text-sm">Story Points / £1k</span>
          </div>

          <div className="h-32 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={devDollarData}>
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  style={{ fontSize: 10 }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1419",
                    border: "1px solid #f59e0b",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f59e0b", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ fill: "#f59e0b", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">Quarterly Avg</div>
            <div className="text-xs text-amber-400 font-semibold">Stable</div>
          </div>
        </motion.div>
      )}

      {/* Operational Burn Heatmap Card - Cost Correlation */}
      {costHeatmapData && costHeatmapLabels && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0d1117]/80 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold mb-4">
            Operational Burn Heatmap
          </h3>

          <div className="space-y-1">
            {costHeatmapData.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center gap-1">
                <div className="w-40 text-xs text-slate-400 truncate">
                  {costHeatmapLabels.y[rowIdx]}
                </div>
                <div className="flex items-center gap-1">
                  {row.map((value, colIdx) => (
                    <div
                      key={colIdx}
                      className={`w-8 h-8 rounded-sm ${getHeatmapColor(value)} transition-all hover:scale-110 cursor-pointer`}
                      title={`${costHeatmapLabels.x[colIdx]}: ${(value * 100).toFixed(0)}%`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              <span className="text-red-500 font-semibold">(19%)</span> IDE
              Subscription
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              Serverless Functions
            </div>
          </div>
        </motion.div>
      )}

      {/* ROI Divergence Chart - Cost Correlation */}
      {valueSpendData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-[#0d1117]/80 border border-slate-800 rounded-2xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">
              The "ROI Divergence" Chart
            </h3>
            <p className="text-sm text-slate-400">Value vs. Spend Over Time</p>
          </div>

          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={valueSpendData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1419",
                    border: "2px solid #06b6d4",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0 8px 32px rgba(6, 182, 212, 0.2)",
                  }}
                  labelStyle={{
                    color: "#06b6d4",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  itemStyle={{
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                  cursor={{ stroke: "#06b6d4", strokeWidth: 2 }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                  }}
                  iconType="square"
                />
                <Area
                  type="monotone"
                  dataKey="commits"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#colorCost)"
                  name="Cost"
                  isAnimationActive={true}
                  animationDuration={800}
                  dot={{ fill: "#ef4444", r: 4, strokeWidth: 0 }}
                  activeDot={{ fill: "#ef4444", r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#colorValue)"
                  name="Value Delivered (Commits + Tickets)"
                  isAnimationActive={true}
                  animationDuration={800}
                  dot={{ fill: "#06b6d4", r: 4, strokeWidth: 0 }}
                  activeDot={{ fill: "#06b6d4", r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-400 font-semibold whitespace-nowrap">
              Cost Divergence Zone
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 text-xs">
            <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors flex items-center gap-2">
              <span>☐</span> Weekly
            </button>
            <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors flex items-center gap-2">
              <span>✕</span> Quarterly
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CostCorrelation;
