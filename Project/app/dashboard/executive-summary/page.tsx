'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  Plug,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import DashboardCrads from '@/components/DashboardRoutesComponets/ActionFeedComponents/DashboardCrads';
import DashboardStatsOverview from '@/components/DashboardRoutesComponets/DashboardStatsOverview';
import ExecutiveSummary from '@/components/DashboardRoutesComponets/Executivesummary/ExecutiveSummary';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { useActionStore } from '@/lib/store/actionStore';
import {
  generateAllInsights,
  generateInsightsForConnector,
} from '@/lib/utils/insightsGenerator';
import { getConnectorIcon } from '@/lib/utils/connectorIconUtils';
const ExecutiveSummaryDashboard = () => {
  const { connectedConnectors, auditLog } = useConnectorStore();
  const { actions: insights, setActions } = useActionStore();
  const highPriorityThreshold = 70;
  const hasConnectors = connectedConnectors.length > 0;
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    if (connectedConnectors.length === 0) return;

    const existingConnectorNames = new Set(
      insights
        .map((insight) => insight.connectorName?.toLowerCase())
        .filter((name): name is string => Boolean(name)),
    );

    const missingConnectors = connectedConnectors.filter(
      (connector) => !existingConnectorNames.has(connector.name.toLowerCase()),
    );

    if (insights.length === 0) {
      setActions(generateAllInsights(connectedConnectors));
      return;
    }

    if (missingConnectors.length > 0) {
      const additions = missingConnectors.flatMap((connector, index) =>
        generateInsightsForConnector(connector, index),
      );
      const merged = [...insights, ...additions].sort(
        (a, b) => b.impactScore - a.impactScore,
      );
      setActions(merged);
    }
  }, [connectedConnectors, insights, setActions]);

  // Match Action Feed logic: up to 2 high-priority actions per connector, grouped by connectorName
  const connectorStats = useMemo(() => {
    const stats = new Map<
      string,
      {
        id: string;
        name: string;
        connectedAt?: string;
        actionCount: number;
        highPriorityCount: number;
        avgConfidence: number;
      }
    >();

    connectedConnectors.forEach((connector) => {
      stats.set(connector.name.toLowerCase(), {
        id: connector.id,
        name: connector.name,
        connectedAt: connector.connectedAt,
        actionCount: 0,
        highPriorityCount: 0,
        avgConfidence: 0,
      });
    });

    // Group insights by connector
    const grouped: Record<string, typeof insights> = {};
    insights.forEach((insight) => {
      const key = insight.connectorName?.toLowerCase();
      if (!key || !stats.has(key)) return;
      grouped[key] = grouped[key] || [];
      grouped[key].push(insight);
    });

    // For each connector, count ALL high-priority actions
    Object.entries(grouped).forEach(([key, group]) => {
      const entry = stats.get(key);
      if (!entry) return;
      entry.actionCount = group.length;
      // Count all high-priority actions, not just top 2
      const allHighPriority = group.filter(
        (insight) => insight.impactScore >= highPriorityThreshold,
      );
      entry.highPriorityCount = allHighPriority.length;
      // Average confidence
      if (group.length > 0) {
        entry.avgConfidence = Math.round(
          group.reduce((sum, i) => sum + i.confidence, 0) / group.length,
        );
      }
    });

    return Array.from(stats.values()).sort((a, b) => {
      if (b.highPriorityCount !== a.highPriorityCount) {
        return b.highPriorityCount - a.highPriorityCount;
      }
      return b.actionCount - a.actionCount;
    });
  }, [connectedConnectors, insights, highPriorityThreshold]);

  const totalActions = connectorStats.reduce(
    (sum, stat) => sum + stat.actionCount,
    0,
  );
  const totalHighPriority = connectorStats.reduce(
    (sum, stat) => sum + stat.highPriorityCount,
    0,
  );
  const avgConfidence = connectorStats.length
    ? Math.round(
        connectorStats.reduce((sum, stat) => sum + stat.avgConfidence, 0) /
          connectorStats.length,
      )
    : 0;
  const highPriorityRatio = totalActions
    ? Math.round((totalHighPriority / totalActions) * 100)
    : 0;

  const latestConnectedAt = connectorStats
    .map((stat) => stat.connectedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  const latestSyncLabel = latestConnectedAt
    ? new Date(latestConnectedAt).toLocaleDateString()
    : 'Not available';

  const actionVolumeData = useMemo(() => {
    if (!hasConnectors) return undefined;
    return connectorStats.slice(0, 8).map((connector) => ({
      month: connector.name,
      value: connector.actionCount,
    }));
  }, [connectorStats, hasConnectors]);

  const connectorGraphData = useMemo(() => {
    if (!hasConnectors) return undefined;
    return connectorStats.slice(0, 6).map((connector) => ({
      date: connector.name,
      devVelocity: connector.actionCount,
      cost: connector.highPriorityCount,
    }));
  }, [connectorStats, hasConnectors]);

  const strategicActionItems = useMemo(() => {
    if (!hasConnectors || insights.length === 0) return [];
    // Show ALL high-priority actions, sorted by impact score
    const highPriorityActions = insights
      .filter((insight) => insight.impactScore >= highPriorityThreshold)
      .sort((a, b) => b.impactScore - a.impactScore);

    const filteredActions =
      actionFilter === 'all'
        ? highPriorityActions
        : highPriorityActions.filter(
            (insight) => (insight.connectorName || 'General') === actionFilter,
          );

    return filteredActions.map((insight, index) => {
      const connectorLabel = insight.connectorName || 'General';
      return {
        id: index + 1,
        title: insight.title,
        description: `${connectorLabel} - ${insight.description}`,
        delay: 1.1 + index * 0.1,
        hasAlert: true,
        hasRedBorder: true,
      };
    });
  }, [insights, highPriorityThreshold, hasConnectors, actionFilter]);

  const actionFilterOptions = useMemo(() => {
    const options = new Set<string>();
    insights.forEach((insight) => {
      options.add(insight.connectorName || 'General');
    });
    return Array.from(options).sort();
  }, [insights]);

  return (
    <div className='space-y-6'>
      {/* Dashboard Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardStatsOverview />
      </motion.div>

      {hasConnectors && (
        <>
          {/* Header with Connector Priorities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-3'
          >
            <h2 className='text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary'>
              Executive Summary
            </h2>
            <div className='flex flex-wrap gap-2'>
              {connectorStats.map((connector) => (
                <div
                  key={connector.id}
                  className='flex items-center gap-2 bg-light-border/40 dark:bg-dark-border/40 border border-light-border/60 dark:border-dark-border/60 rounded-lg px-3 py-1 text-xs'
                >
                  <span className='font-semibold text-light-text-primary dark:text-dark-text-primary'>
                    {connector.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-bold ${
                      connector.highPriorityCount > 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    {connector.highPriorityCount} priority
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Integration Overview and Health */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='grid grid-cols-1 lg:grid-cols-3 gap-6'
          >
            {/* Integration Coverage Card */}
            <div className='lg:col-span-2'>
              {connectorStats.length > 0 && (
                <div className='bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6'>
                  <div className='flex items-center gap-2 mb-4'>
                    <Plug className='w-4 h-4 text-cyan-400' />
                    <h3 className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary'>
                      Integration Coverage
                    </h3>
                    <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary ml-auto'>
                      {connectedConnectors.length} connected
                    </span>
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    {connectorStats.map((stat) => (
                      <div key={stat.id} className='text-center'>
                        <p className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-1'>
                          {stat.name}
                        </p>
                        <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                          {stat.actionCount} actions
                        </p>
                        {stat.highPriorityCount > 0 && (
                          <p className='text-xs text-red-400 font-semibold'>
                            {stat.highPriorityCount} priority
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Priority Alerts */}
            <div className='bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <AlertCircle className='w-4 h-4 text-red-400' />
                <h3 className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary'>
                  Priority Alerts
                </h3>
              </div>
              <div className='text-3xl font-bold text-red-400 mb-4'>
                {totalHighPriority}
              </div>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                {highPriorityRatio}% of actions flagged as critical priority
              </p>
            </div>
          </motion.div>

          {/* Health Briefing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6'
          >
            <h3 className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3'>
              Health Summary
            </h3>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed'>
              {connectorStats.length > 0
                ? connectorStats.map((connector, idx) => (
                    <span key={connector.id}>
                      <span className='font-semibold text-light-text-primary dark:text-dark-text-primary'>
                        {connector.name}
                      </span>{' '}
                      has{' '}
                      <span
                        className={
                          connector.highPriorityCount > 0
                            ? 'text-red-400 font-bold'
                            : 'text-emerald-300 font-bold'
                        }
                      >
                        {connector.highPriorityCount} priority
                      </span>
                      {idx < connectorStats.length - 1 ? ', ' : ''}
                    </span>
                  ))
                : 'No connectors connected.'}{' '}
              Total actions: {totalActions}. Average confidence: {avgConfidence}
              %. Latest sync: {latestSyncLabel}.
            </p>
          </motion.div>

          {/* Graph */}
          {connectorGraphData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ExecutiveSummary synthesisData={connectorGraphData} />
            </motion.div>
          )}

          {/* Strategic Action Items */}
          {strategicActionItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary'>
                  Strategic Action Items
                </h3>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                    Filter
                  </span>
                  <select
                    className='px-3 py-2 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border text-xs focus:ring-2 focus:ring-cyan-500'
                    value={actionFilter}
                    onChange={(event) => setActionFilter(event.target.value)}
                  >
                    <option value='all'>All connectors</option>
                    {actionFilterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DashboardCrads actionItems={strategicActionItems} />
            </motion.div>
          )}
        </>
      )}

      {!hasConnectors && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-8 text-center'
        >
          <Plug className='w-12 h-12 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4 opacity-50' />
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            No Data Available
          </h3>
          <p className='text-light-text-secondary dark:text-dark-text-secondary'>
            Connect your first integration to see executive insights and
            recommendations.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ExecutiveSummaryDashboard;
