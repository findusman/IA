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
} from 'recharts';
import { DashboardChartsProps } from '@/types';
const ExecutiveSummary = ({
  runwayData,
  synthesisData,
}: DashboardChartsProps) => {
  return (
    <>
      {/* Runway Chart */}
      {runwayData && (
        <div className='h-16 -mx-2 mb-2'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={runwayData}>
              <Line
                type='monotone'
                dataKey='value'
                stroke='#06b6d4'
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* The Synthesis Graph */}
      {synthesisData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className='bg-[#0f172a]/50 border border-slate-800 rounded-xl p-6 mb-8 relative overflow-hidden'
        >
          <h2 className='text-xl font-semibold mb-6'>Connector Impact Graph</h2>

          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={synthesisData}>
                <defs>
                  <linearGradient id='devVelocity' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#06b6d4' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#06b6d4' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='cost' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#ef4444' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#374151'
                  vertical={false}
                />
                <XAxis
                  dataKey='date'
                  stroke='#6B7280'
                  style={{ fontSize: '11px' }}
                  tickFormatter={(value) =>
                    typeof value === 'string' && value.length > 10
                      ? `${value.slice(0, 10)}...`
                      : value
                  }
                />
                <YAxis stroke='#6B7280' style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type='monotone'
                  dataKey='devVelocity'
                  stroke='#06b6d4'
                  strokeWidth={2.5}
                  fill='url(#devVelocity)'
                  name='Total Actions'
                />
                <Area
                  type='monotone'
                  dataKey='cost'
                  stroke='#ef4444'
                  strokeWidth={2.5}
                  fill='url(#cost)'
                  name='High Priority'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with Sprint Markers */}
          <div className='flex items-center justify-center gap-8 mt-4'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-cyan-500' />
              <span className='text-xs text-slate-400'>Total Actions</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-red-500' />
              <span className='text-xs text-slate-400'>High Priority</span>
            </div>
            <button className='px-4 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded text-xs transition-all'>
              Deep Dive
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ExecutiveSummary;
