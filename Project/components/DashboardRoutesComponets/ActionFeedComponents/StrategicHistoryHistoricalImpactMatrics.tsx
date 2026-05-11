import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import React, { useEffect, useId, useState } from 'react';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { useActionStore } from '@/lib/store/actionStore';

function ProgressRing({
  size = 56,
  stroke = 6,
  percent = 92,
}: {
  size?: number;
  stroke?: number;
  percent?: number;
}) {
  const uid = useId();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg
      width={size}
      height={size}
      style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.25))' }}
    >
      <defs>
        <linearGradient id={`ring-grad-${uid}`} x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor='#22d3ee' />
          <stop offset='100%' stopColor='#818cf8' />
        </linearGradient>
      </defs>
      {/* Track with subtle ticks */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke='#1f2937'
        strokeWidth={stroke}
        fill='none'
        strokeDasharray='4 8'
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={`url(#ring-grad-${uid})`}
        strokeWidth={stroke}
        fill='none'
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap='round'
        style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
      />
      {/* Center text */}
      <text
        x='50%'
        y='50%'
        dominantBaseline='middle'
        textAnchor='middle'
        fontSize={12}
        fill='#d1d5db'
        fontWeight={600}
      >
        {percent}%
      </text>
    </svg>
  );
}

function MetricCard({
  title,
  value,
  icon,
  variant = 'ring',
  ringPercent,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'ring';
  ringPercent?: number;
}) {
  return (
    <div className='rounded-xl p-5 bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border flex items-center gap-4'>
      <div className='w-10 h-10 rounded-lg bg-light-border/60 dark:bg-dark-border/60 flex items-center justify-center'>
        {icon}
      </div>
      <div className='flex-1'>
        <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
          {title}
        </p>
        <p className='text-xl font-semibold'>{value}</p>
      </div>
      {variant === 'ring' && ringPercent !== undefined && (
        <ProgressRing percent={ringPercent} />
      )}
    </div>
  );
}

const StrategicHistoryHistoricalImpactMatrics = () => {
  const { connectedConnectors } = useConnectorStore();
  const { actions: insights } = useActionStore();

  const metrics = {
    totalInsights: insights.length,
    criticalInsights: insights.filter((i) => i.impactScore >= 80).length,
    avgConfidence:
      insights.length > 0
        ? Math.round(
            insights.reduce((acc, i) => acc + (i.confidence || 0), 0) /
              insights.length,
          )
        : 0,
  };

  const criticalPercent =
    metrics.totalInsights > 0
      ? Math.round((metrics.criticalInsights / metrics.totalInsights) * 100)
      : 0;

  return (
    <div className='rounded-2xl border border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-surface/60'>
      <div className='p-4 border-b border-light-border dark:border-dark-border'>
        <h3 className='font-medium'>Historical Impact Metrics</h3>
      </div>
      <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <MetricCard
          title='Total Insights Generated'
          value={metrics.totalInsights}
          icon={<TrendingUp className='w-5 h-5 text-emerald-500' />}
        />
        <MetricCard
          title='Critical Priority Actions'
          value={metrics.criticalInsights}
          icon={<AlertTriangle className='w-5 h-5 text-red-500' />}
          variant='ring'
          ringPercent={criticalPercent}
        />
        <MetricCard
          title='Average Confidence Score'
          value={`${metrics.avgConfidence}%`}
          icon={<CheckCircle2 className='w-5 h-5 text-cyan-500' />}
          variant='ring'
          ringPercent={metrics.avgConfidence}
        />
      </div>
    </div>
  );
};

export default StrategicHistoryHistoricalImpactMatrics;
