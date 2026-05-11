import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
} from 'recharts';
import { DashboardChartsProps } from '@/types';

// 🔹 Random micro offset helper
const randomOffset = () => ({
  x: Math.random() * 16 - 8, // -8px → +8px
  y: Math.random() * 16 - 8,
});

const DomainInsights = ({
  metricCards,
  technicalDebtData,
  heatmapData,
}: DashboardChartsProps) => {
  return (
    <>
      {/* Metric Cards Charts */}
      {metricCards && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {metricCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative overflow-hidden rounded-xl p-6 backdrop-blur border transition-all ${
                card.trend === 'up'
                  ? 'bg-linear-to-br from-blue-950/40 to-blue-900/20 border-blue-500/30 shadow-blue-500/20'
                  : card.trend === 'down'
                    ? 'bg-linear-to-br from-red-950/40 to-red-900/20 border-red-500/30 shadow-red-500/20'
                    : 'bg-linear-to-br from-slate-900/40 to-slate-800/20 border-slate-700/50'
              }`}
            >
              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 hover:opacity-5 transition-opacity`}
              />

              <div className='relative z-10'>
                {/* Header */}
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-sm font-semibold text-slate-300'>
                    {card.title}
                  </h3>

                  {card.badge && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        card.trend === 'up'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Chart */}
                <div
                  className={`mb-6 ${
                    card.id === '2' || card.id === '3' ? 'h-36' : 'h-28'
                  }`}
                >
                  {/* Card 1: Total Users */}
                  {card.id === '1' && (
                    <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart
                        data={card.trendData.map((value, idx) => ({
                          value,
                          index: idx,
                        }))}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        {/* Gradient fill */}
                        <defs>
                          <linearGradient
                            id='gradient-area'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='0%'
                              stopColor={
                                card.trend === 'up'
                                  ? '#10B981'
                                  : card.trend === 'down'
                                    ? '#EF4444'
                                    : '#3B82F6'
                              }
                              stopOpacity={0.3}
                            />
                            <stop
                              offset='100%'
                              stopColor={
                                card.trend === 'up'
                                  ? '#10B981'
                                  : card.trend === 'down'
                                    ? '#EF4444'
                                    : '#3B82F6'
                              }
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        {/* Area under the line */}
                        <Area
                          type='monotone'
                          dataKey='value'
                          stroke='none'
                          fill='url(#gradient-area)'
                          isAnimationActive={true}
                        />

                        {/* Main line */}
                        <Line
                          type='monotone'
                          dataKey='value'
                          stroke={
                            card.trend === 'up'
                              ? '#10B981'
                              : card.trend === 'down'
                                ? '#EF4444'
                                : '#3B82F6'
                          }
                          strokeWidth={1.5}
                          dot={false}
                          isAnimationActive={true}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {/* Card 2: Revenue Growth */}
                  {card.id === '2' && (
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={card.trendData}>
                        <CartesianGrid
                          strokeDasharray='3 3'
                          stroke='#374151'
                          vertical={false}
                        />
                        <XAxis
                          dataKey='name'
                          stroke='#9CA3AF'
                          style={{ fontSize: '11px' }}
                        />
                        <YAxis stroke='#9CA3AF' style={{ fontSize: '11px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1f2e',
                            border: '1px solid #374151',
                          }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Line
                          type='monotone'
                          dataKey='value'
                          stroke='#06B6D4'
                          strokeWidth={2.5}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}

                  {/* Card 3: Sprint Burndown */}
                  {card.id === '3' && (
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={card.trendData}>
                        <CartesianGrid
                          strokeDasharray='3 3'
                          stroke='#374151'
                          vertical={false}
                        />
                        <XAxis
                          dataKey='day'
                          stroke='#9CA3AF'
                          style={{ fontSize: '11px' }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1f2e',
                            border: '1px solid #374151',
                          }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Line
                          type='monotone'
                          dataKey='ideal'
                          stroke='#ef4444'
                          strokeWidth={2}
                          dot={false}
                          strokeDasharray='5 5'
                        />
                        <Line
                          type='monotone'
                          dataKey='actual'
                          stroke='#3b82f6'
                          strokeWidth={2.5}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Footer */}
                <div className='flex items-end justify-between'>
                  <div>
                    <div className='text-4xl font-bold text-white'>
                      {card.value}
                    </div>
                    <div className='text-xs text-slate-400 mt-2'>
                      {card.subtitle}
                    </div>
                  </div>

                  {card.id === '3' && (
                    <div className='w-8 h-8 bg-[#3483eb] rounded-lg flex items-center justify-center shadow-lg'>
                      <span className='text-xs font-bold text-white'>J</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Technical Debt Index Chart */}
      {technicalDebtData && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className='bg-[#1a1f2e]/50 backdrop-blur border border-slate-700/50 rounded-xl px-6 pt-5 flex flex-col justify-between'
        >
          <div className='w-full mb-4'>
            <h3 className='text-lg font-semibold mb-4'>Technical Debt Index</h3>

            <div className='mb-4'>
              <span className='inline-block px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold'>
                High
              </span>
            </div>

            <div className='text-xs text-slate-400 mb-4'>
              Calculated from: Bug-fix commits (GitHub) vs. Feature issues
              (Jira)
            </div>
          </div>
          <div className='w-full h-36'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={technicalDebtData}>
                {/* Tooltip on hover */}
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff', fontSize: '12px' }}
                  formatter={(value) =>
                    value ? [`${value}`, 'Score'] : ['N/A', 'Score']
                  }
                />

                <Bar dataKey='value' radius={[6, 6, 0, 0]}>
                  {technicalDebtData.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Heatmap Cards Grid */}
      {heatmapData && (
        <div className='grid grid-cols-3 gap-3'>
          {heatmapData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                scale: 0.8,
                ...randomOffset(),
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: 'easeOut',
              }}
              whileHover={{
                scale: 1.08,
              }}
              className={`relative overflow-hidden cursor-pointer rounded-lg p-3 shadow-lg hover:shadow-xl transition-all ${item.color}`}
            >
              {/* Hover Overlay */}
              <div className='absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity' />

              {/* Content */}
              <div className='relative z-10 flex flex-col justify-between'>
                <div className='text-xs font-semibold text-white/90'>
                  {item.title}
                </div>
                <div className='text-xl font-bold text-white'>{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default DomainInsights;
