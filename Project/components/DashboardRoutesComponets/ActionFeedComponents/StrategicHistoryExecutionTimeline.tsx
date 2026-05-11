import { LineChart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { useActionStore } from '@/lib/store/actionStore';

function AnimatedDualLineChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(420);
  const height = 160;
  const { actions: insights } = useActionStore();

  // Generate data based on insight counts over time
  const [chartData, setChartData] = useState<{
    totalActions: number[];
    criticalActions: number[];
  }>(() => {
    const total = Array(28).fill(0);
    const critical = Array(28).fill(0);

    // Populate with actual insight data (spread across time slots)
    insights.forEach((insight, idx) => {
      const slot = idx % 28;
      total[slot]++;
      if (insight.impactScore >= 80) {
        critical[slot]++;
      }
    });

    // Normalize to 0-1 range
    const maxTotal = Math.max(...total, 1);
    const maxCritical = Math.max(...critical, 1);

    return {
      totalActions: total.map((v) => v / maxTotal),
      criticalActions: critical.map((v) => v / maxCritical),
    };
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setWidth(Math.max(320, Math.floor(cr.width - 24)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toPts = (arr: number[]) =>
    arr.map(
      (v, i) =>
        [(i / (arr.length - 1)) * width, height - v * height * 0.8] as const,
    );
  const path = (pts: readonly (readonly [number, number])[]) =>
    pts.reduce(
      (acc, [x, y], i) => (i === 0 ? `M ${x},${y}` : acc + ` L ${x},${y}`),
      '',
    );
  const pc = toPts(chartData.totalActions);
  const pp = toPts(chartData.criticalActions);

  return (
    <div
      ref={containerRef}
      className='rounded-xl border border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-surface/60 p-3 w-full'
    >
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <LineChart className='w-4 h-4' />
          <span className='text-sm font-medium'>Insights Over Time</span>
        </div>
        <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
          Activity Timeline
        </span>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id='grad-a' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#22d3ee' />
            <stop offset='100%' stopColor='#818cf8' />
          </linearGradient>
          <linearGradient id='grad-b' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#ef4444' />
            <stop offset='100%' stopColor='#f97316' />
          </linearGradient>
        </defs>
        <path d={path(pc)} stroke='url(#grad-a)' strokeWidth={2} fill='none' />
        <path d={path(pp)} stroke='url(#grad-b)' strokeWidth={2} fill='none' />
      </svg>
      <div className='mt-2 flex items-center gap-4 text-xs'>
        <span className='inline-flex items-center gap-1'>
          <span className='w-3 h-0.5 bg-cyan-400 inline-block' /> Total Insights
        </span>
        <span className='inline-flex items-center gap-1'>
          <span className='w-3 h-0.5 bg-red-500 inline-block' /> Critical
          Actions
        </span>
      </div>
    </div>
  );
}

function TimelineCard({
  title,
  connectorName,
  impactScore,
  confidence,
  timestamp,
  color,
}: {
  title: string;
  connectorName: string;
  impactScore: number;
  confidence: number;
  timestamp?: string;
  color: 'red' | 'green' | 'cyan';
}) {
  const colorMap = {
    red: { bg: '#ef4444', text: 'text-red-500' },
    green: { bg: '#10b981', text: 'text-green-500' },
    cyan: { bg: '#22d3ee', text: 'text-cyan-500' },
  };

  const isCritical = impactScore >= 80;

  return (
    <div className='rounded-xl p-4 bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border'>
      <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
        {timestamp || new Date().toLocaleDateString()}
      </div>
      <div className='mt-2 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span
            className='w-2 h-2 rounded-full'
            style={{ background: colorMap[color].bg }}
          ></span>
          <p className='font-medium'>{title}</p>
        </div>
        <span className={`${colorMap[color].text} font-semibold`}>
          {impactScore}%
        </span>
      </div>
      <ul className='mt-3 space-y-2'>
        <li className='flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          <span
            className='w-2 h-2 rounded-full'
            style={{ background: colorMap[color].bg }}
          ></span>
          Connector: {connectorName}
        </li>
        <li className='flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          <span
            className='w-2 h-2 rounded-full'
            style={{ background: '#818cf8' }}
          ></span>
          Confidence: {confidence}%
        </li>
      </ul>
      <div className='mt-3 flex items-center gap-2'>
        <button className='px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-sm hover:bg-light-border/80 dark:hover:bg-dark-border/80'>
          View Details
        </button>
        <button className='px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-sm hover:bg-light-border/80 dark:hover:bg-dark-border/80'>
          Actions
        </button>
      </div>
    </div>
  );
}

const StrategicHistoryExecutionTimeline = () => {
  const { actions: insights } = useActionStore();

  // Get the 4 most recent/significant insights
  const displayInsights = useMemo(() => {
    return insights.sort((a, b) => b.impactScore - a.impactScore).slice(0, 4);
  }, [insights]);

  const getColor = (score: number): 'red' | 'green' | 'cyan' => {
    if (score >= 80) return 'red';
    if (score >= 60) return 'cyan';
    return 'green';
  };

  return (
    <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
      {/* Left column */}
      <div className='space-y-6 xl:col-span-2'>
        <h3 className='font-medium'>Execution Timeline</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {displayInsights.length > 0 ? (
            displayInsights.map((insight) => (
              <TimelineCard
                key={insight.id}
                title={insight.title}
                connectorName={insight.connectorName || 'Unknown'}
                impactScore={insight.impactScore}
                confidence={insight.confidence}
                timestamp={new Date().toLocaleDateString()}
                color={getColor(insight.impactScore)}
              />
            ))
          ) : (
            <div className='col-span-2 text-center py-8 text-light-text-secondary dark:text-dark-text-secondary'>
              No insights generated yet
            </div>
          )}
        </div>

        <AnimatedDualLineChart />
      </div>

      {/* Right column: Insights Summary */}
      <div className='space-y-4'>
        <div className='rounded-2xl bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border p-4'>
          <h3 className='font-medium mb-3'>Insights Summary</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between px-3 py-2 rounded-lg bg-light-border/60 dark:bg-dark-border/60'>
              <span className='flex items-center gap-2 text-sm'>
                <AlertTriangle className='w-4 h-4 text-red-500' /> Critical
              </span>
              <span className='text-xs font-semibold'>
                {insights.filter((i) => i.impactScore >= 80).length}
              </span>
            </div>
            <div className='flex items-center justify-between px-3 py-2 rounded-lg bg-light-border/60 dark:bg-dark-border/60'>
              <span className='flex items-center gap-2 text-sm'>
                <AlertTriangle className='w-4 h-4 text-cyan-500' /> Medium
              </span>
              <span className='text-xs font-semibold'>
                {
                  insights.filter(
                    (i) => i.impactScore >= 60 && i.impactScore < 80,
                  ).length
                }
              </span>
            </div>
            <div className='flex items-center justify-between px-3 py-2 rounded-lg bg-light-border/60 dark:bg-dark-border/60'>
              <span className='flex items-center gap-2 text-sm'>
                <CheckCircle2 className='w-4 h-4 text-green-500' /> Low
              </span>
              <span className='text-xs font-semibold'>
                {insights.filter((i) => i.impactScore < 60).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicHistoryExecutionTimeline;
