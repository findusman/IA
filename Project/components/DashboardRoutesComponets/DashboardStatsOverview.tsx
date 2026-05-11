'use client';

import React, { useMemo } from 'react';
import {
  Plug,
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { useActionStore } from '@/lib/store/actionStore';
import BaseCardWrapper from '@/components/GenericComponents/BaseCardWrapper';

const DashboardStatsOverview = () => {
  const { connectedConnectors } = useConnectorStore();
  const { actions: insights } = useActionStore();

  const stats = useMemo(() => {
    const totalConnectors = connectedConnectors.length;
    const totalActions = insights.length;
    const criticalActions = insights.filter(
      (action) => action.impactScore >= 80,
    ).length;
    const highConfidenceActions = insights.filter(
      (action) => action.confidence >= 85,
    ).length;
    const totalSavings = insights.reduce((acc, action) => {
      const match = action.savings?.match(/[\d.]+/);
      return acc + (match ? parseFloat(match[0]) : 0);
    }, 0);

    return {
      totalConnectors,
      totalActions,
      criticalActions,
      highConfidenceActions,
      totalSavings,
      solvedRate:
        totalActions > 0
          ? Math.round((highConfidenceActions / totalActions) * 100)
          : 0,
    };
  }, [connectedConnectors, insights]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit = '',
    color = 'cyan',
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    color?: 'cyan' | 'red' | 'green' | 'yellow';
  }) => {
    const colorMap = {
      cyan: 'from-cyan-500/20 to-blue-500/10',
      red: 'from-red-500/20 to-orange-500/10',
      green: 'from-green-500/20 to-emerald-500/10',
      yellow: 'from-yellow-500/20 to-orange-500/10',
    };

    return (
      <motion.div
        variants={itemVariants}
        className={`bg-linear-to-br ${colorMap[color]} border border-light-border/30 dark:border-dark-border/30 rounded-xl p-4 flex items-center gap-4`}
      >
        <div className='p-3 rounded-lg bg-light-border/40 dark:bg-dark-border/40 flex items-center justify-center'>
          {Icon}
        </div>
        <div className='flex-1'>
          <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1'>
            {label}
          </p>
          <div className='flex items-baseline gap-1'>
            <p className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
              {value}
            </p>
            {unit && (
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                {unit}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <BaseCardWrapper className='flex-col'>
      <div className='mb-6 w-full'>
        <h2 className='text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
          Overview
        </h2>
        <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          Your app is actively monitoring and optimizing across{' '}
          {stats.totalConnectors}{' '}
          {stats.totalConnectors === 1 ? 'connector' : 'connectors'}.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 w-full'
      >
        <StatCard
          icon={<Plug className='w-5 h-5 text-cyan-400' />}
          label='Connected Connectors'
          value={stats.totalConnectors}
          color='cyan'
        />

        <StatCard
          icon={<Zap className='w-5 h-5 text-yellow-400' />}
          label='Total Actions Identified'
          value={stats.totalActions}
          color='yellow'
        />

        <StatCard
          icon={<AlertTriangle className='w-5 h-5 text-red-400' />}
          label='Critical Priority'
          value={stats.criticalActions}
          unit={`(${stats.totalActions > 0 ? Math.round((stats.criticalActions / stats.totalActions) * 100) : 0}%)`}
          color='red'
        />

        <StatCard
          icon={<CheckCircle2 className='w-5 h-5 text-green-400' />}
          label='High Confidence'
          value={stats.highConfidenceActions}
          unit={`(${stats.solvedRate}%)`}
          color='green'
        />

        <StatCard
          icon={<TrendingUp className='w-5 h-5 text-emerald-400' />}
          label='Estimated Impact'
          value={stats.totalSavings.toFixed(1)}
          unit='hrs'
          color='green'
        />
      </motion.div>

      {/* What the app is doing section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='mt-8 pt-6 border-t border-light-border/30 dark:border-dark-border/30 w-full'
      >
        <h3 className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3'>
          What your app is doing
        </h3>
        <ul className='space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 mt-1'>✓</span>
            <span>
              Analyzing {stats.totalConnectors} connected data sources for
              optimization opportunities
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 mt-1'>✓</span>
            <span>
              Identifying {stats.totalActions} actionable insights across your
              infrastructure
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 mt-1'>✓</span>
            <span>
              Prioritizing {stats.criticalActions} critical actions that require
              immediate attention
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 mt-1'>✓</span>
            <span>
              Providing execution logs and audit trails for compliance and
              traceability
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 mt-1'>✓</span>
            <span>
              Estimating ~{stats.totalSavings.toFixed(1)} hours of total
              productivity gains
            </span>
          </li>
        </ul>
      </motion.div>
    </BaseCardWrapper>
  );
};

export default DashboardStatsOverview;
