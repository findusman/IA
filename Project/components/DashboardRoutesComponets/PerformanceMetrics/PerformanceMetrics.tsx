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
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { DashboardChartsProps } from '@/types';
const PerformanceMetrics = ({
  backgroundAreaData,
  pieData,
  performanceRelaysData,
}: DashboardChartsProps) => {
  return (
    <>
      {/* Background Area Chart - GrowthVelocityScore */}
      {backgroundAreaData && (
        <div className='absolute inset-0 z-40 opacity-30'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={backgroundAreaData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <defs>
                <linearGradient id='colorFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#06b6d4' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#06b6d4' stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey='name'
                stroke='transparent'
                tick={false}
                axisLine={false}
              />
              <YAxis stroke='transparent' tick={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1419',
                  border: '2px solid #06b6d4',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2)',
                }}
                labelStyle={{
                  color: '#06b6d4',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
                itemStyle={{
                  color: '#06b6d4',
                  fontSize: '12px',
                }}
                cursor={{ stroke: '#06b6d4', strokeWidth: 2 }}
                formatter={(value) =>
                  value
                    ? [`$${value.toLocaleString()}`, 'Value']
                    : ['N/A', 'Value']
                }
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type='monotone'
                dataKey='value'
                stroke='#06b6d4'
                strokeWidth={3}
                fill='url(#colorFill)'
                isAnimationActive={true}
                animationDuration={800}
                dot={{ fill: '#06b6d4', r: 4, strokeWidth: 0 }}
                activeDot={{
                  fill: '#06b6d4',
                  r: 6,
                  strokeWidth: 0,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie Chart - GrowthVelocityScore */}
      {pieData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className='lg:col-span-4 flex items-center justify-center'
        >
          <div className='relative w-70 h-70'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  outerRadius='100%'
                  dataKey='value'
                  startAngle={90}
                  endAngle={-270}
                  stroke='none'
                  isAnimationActive
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#ffffff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* ───────── Compass Labels ───────── */}
            {/* Top (North) */}
            <div className='absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-300'>
              Speed
            </div>

            {/* Bottom (South) */}
            <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-300'>
              Quality
            </div>

            {/* Left (West) */}
            <div className='absolute -left-8 top-1/2 -translate-y-1/2 text-xs text-slate-300 -rotate-90'>
              Speed
            </div>

            {/* Right (East) */}
            <div className='absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-slate-300 rotate-90'>
              Quality
            </div>
          </div>
        </motion.div>
      )}

      {/* Performance Relays Chart - GrowthVelocityScore */}
      {performanceRelaysData && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className='bg-[#1a1f2e]/50 border border-slate-700/50 rounded-xl p-4'
        >
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-2 h-2 bg-blue-500 rounded-full' />
            <h3 className='text-sm font-semibold'>
              Current Performance Relays
            </h3>
          </div>

          <div className='h-48'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={performanceRelaysData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#374151'
                  vertical={false}
                />
                <XAxis
                  dataKey='month'
                  stroke='#6B7280'
                  style={{ fontSize: '10px' }}
                />
                <YAxis stroke='#6B7280' style={{ fontSize: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff', fontSize: '11px' }}
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#10B981'
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10B981' }}
                />
                <Line
                  type='monotone'
                  dataKey='baseline'
                  stroke='#06B6D4'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PerformanceMetrics;
