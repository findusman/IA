'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Zap, ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';
import FeedbackLoop from '@/components/GenericComponents/FeedbackLoop';
import PrescriptiveInsightsImpactSimulationRange from '@/components/DashboardRoutesComponets/ActionFeedComponents/PrescriptiveInsightsImpactSimulationRange';
import PrescriptiveInsightsImpactSimulationChart from '@/components/DashboardRoutesComponets/ActionFeedComponents/PrescriptiveInsightsImpactSimulationChart';
import BaseCardWrapper from '@/components/GenericComponents/BaseCardWrapper';
import PrescriptiveInsightsCard from '@/components/DashboardRoutesComponets/ActionFeedComponents/PrescriptiveInsightsCard';
import GenericPageHeader from '@/components/GenericComponents/GenericPageHeader';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { useActionStore } from '@/lib/store/actionStore';
import {
  generateAllInsights,
  generateInsightsForConnector,
} from '@/lib/utils/insightsGenerator';
import type { Insight } from '@/lib/utils/insightsGenerator';

// ── Log type system ─────────────────────────────────────────────────────────
type LogKind = 'info' | 'warn' | 'error' | 'retry' | 'question' | 'answer';
type LogLine = { text: string; kind: LogKind };

function parseLog(raw: string): { kind: LogKind; text: string } {
  if (raw.startsWith('[ERR]')) return { kind: 'error', text: raw.slice(6) };
  if (raw.startsWith('[WARN]')) return { kind: 'warn', text: raw.slice(7) };
  if (raw.startsWith('[RETRY]')) return { kind: 'retry', text: raw.slice(8) };
  if (raw.startsWith('[Q]')) return { kind: 'question', text: raw.slice(4) };
  return { kind: 'info', text: raw };
}

function stepDelay(kind: LogKind): number {
  switch (kind) {
    case 'error':
      return 2800 + Math.random() * 1700; // 2.8 – 4.5 s (looks like it's really struggling)
    case 'retry':
      return 3200 + Math.random() * 1800; // 3.2 – 5.0 s (long pause before fallback)
    case 'warn':
      return 1800 + Math.random() * 1200; // 1.8 – 3.0 s
    default:
      return 900 + Math.random() * 1600; // 0.9 – 2.5 s (comfortable reading pace)
  }
}

function logStyle(kind: LogKind): { color: string; icon: string } {
  switch (kind) {
    case 'error':
      return { color: 'text-red-400', icon: '✕' };
    case 'warn':
      return { color: 'text-yellow-400', icon: '⚠' };
    case 'retry':
      return { color: 'text-orange-400', icon: '↩' };
    case 'question':
      return { color: 'text-cyan-300', icon: '?' };
    case 'answer':
      return { color: 'text-white/50', icon: '›' };
    default:
      return { color: 'text-emerald-400', icon: '›' };
  }
}

export default function PrescriptiveInsights() {
  const [loading, setLoading] = useState(true);
  const { connectedConnectors } = useConnectorStore();
  const { actions: insights, setActions, removeAction } = useActionStore();
  const [highPriorityByConnector, setHighPriorityByConnector] = useState<
    Record<string, string[]>
  >({});
  const [actionFilter, setActionFilter] = useState('all');

  // Execution modal state
  const [activeInsight, setActiveInsight] = useState<Insight | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIdx = useRef(0);
  const insightRef = useRef<Insight | null>(null);
  // Stored in a ref so recursive setTimeout always calls the latest closure
  const runStepRef = useRef<() => void>(() => {});

  useEffect(() => {
    setLoading(true);
    try {
      if (connectedConnectors.length === 0) {
        if (insights.length > 0) {
          setActions([]);
        }
        return;
      }

      const existingConnectorNames = new Set(
        insights
          .map((insight) => insight.connectorName?.toLowerCase())
          .filter((name): name is string => Boolean(name)),
      );

      const missingConnectors = connectedConnectors.filter(
        (connector) =>
          !existingConnectorNames.has(connector.name.toLowerCase()),
      );

      if (insights.length === 0) {
        setActions(generateAllInsights(connectedConnectors));
      } else if (missingConnectors.length > 0) {
        const additions = missingConnectors.flatMap((connector, index) =>
          generateInsightsForConnector(connector, index),
        );
        const merged = [...insights, ...additions].sort(
          (a, b) => b.impactScore - a.impactScore,
        );
        setActions(merged);
      }
    } catch {
      setActions([]);
    } finally {
      setLoading(false);
    }
  }, [connectedConnectors, insights, setActions]);

  // Auto-remove actions for connectors that have been disconnected
  useEffect(() => {
    if (insights.length === 0) return;
    const connectedNames = new Set(
      connectedConnectors.map((c) => c.name.toLowerCase()),
    );
    const filtered = insights.filter(
      (insight) =>
        !insight.connectorName ||
        connectedNames.has(insight.connectorName.toLowerCase()),
    );
    if (filtered.length !== insights.length) {
      setActions(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedConnectors]);

  useEffect(() => {
    if (insights.length === 0) {
      setHighPriorityByConnector({});
      return;
    }

    const groupKeyForInsight = (insight: Insight) =>
      insight.connectorName?.toLowerCase() ?? 'general';

    const pickRandomIds = (ids: string[], count: number) => {
      const pool = [...ids];
      const picked: string[] = [];
      while (picked.length < count && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(idx, 1)[0]);
      }
      return picked;
    };

    setHighPriorityByConnector((prev) => {
      const grouped = insights.reduce<Record<string, Insight[]>>(
        (acc, insight) => {
          const key = groupKeyForInsight(insight);
          acc[key] = acc[key] ?? [];
          acc[key].push(insight);
          return acc;
        },
        {},
      );

      const next: Record<string, string[]> = {};
      Object.entries(grouped).forEach(([key, group]) => {
        const desiredCount = Math.min(2, group.length);
        const existing = (prev[key] ?? []).filter((id) =>
          group.some((insight) => insight.id === id),
        );
        const remaining = group
          .map((insight) => insight.id)
          .filter((id) => !existing.includes(id));
        const additions = pickRandomIds(
          remaining,
          desiredCount - existing.length,
        );
        next[key] = [...existing, ...additions].slice(0, desiredCount);
      });

      return next;
    });
  }, [insights]);

  const actionFilterOptions = useMemo(() => {
    const options = new Set<string>();
    insights.forEach((insight) => {
      options.add(insight.connectorName || 'General');
    });
    return Array.from(options).sort();
  }, [insights]);

  useEffect(() => {
    if (actionFilter === 'all') return;
    if (!actionFilterOptions.includes(actionFilter)) {
      setActionFilter('all');
    }
  }, [actionFilter, actionFilterOptions]);

  const filteredInsights = useMemo(() => {
    if (actionFilter === 'all') return insights;
    return insights.filter(
      (insight) => (insight.connectorName || 'General') === actionFilter,
    );
  }, [insights, actionFilter]);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // ── Step runner — always sync'd to the latest closure via ref ─────────────
  runStepRef.current = () => {
    const insight = insightRef.current;
    if (!insight) return;
    const steps = insight.executionLogs;
    const idx = stepIdx.current;

    if (idx >= steps.length) {
      setIsRunning(false);
      setIsDone(true);
      removeAction(insight.id);
      return;
    }

    const { kind, text } = parseLog(steps[idx]);

    if (kind === 'question') {
      // Show question then pause — execution resumes after user clicks Yes / No
      setLogs((prev) => [...prev, { text, kind: 'question' }]);
      setPendingQuestion(text);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setLogs((prev) => [...prev, { text, kind }]);
      stepIdx.current = idx + 1;
      runStepRef.current();
    }, stepDelay(kind));
  };

  const openExecute = (id: string) => {
    const insight = insights.find((i) => i.id === id);
    if (!insight) return;
    insightRef.current = insight;
    stepIdx.current = 0;
    setActiveInsight(insight);
    setLogs([]);
    setIsRunning(false);
    setIsDone(false);
    setPendingQuestion(null);
  };

  const closeModal = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    insightRef.current = null;
    stepIdx.current = 0;
    setActiveInsight(null);
    setLogs([]);
    setIsRunning(false);
    setIsDone(false);
    setPendingQuestion(null);
  };

  const startExecution = () => {
    if (!activeInsight || isRunning || pendingQuestion) return;
    setIsRunning(true);
    setIsDone(false);
    setLogs([]);
    stepIdx.current = 0;
    timeoutRef.current = setTimeout(runStepRef.current, 350);
  };

  const answerQuestion = (yes: boolean) => {
    const reply = yes
      ? '> Confirmed — proceeding with changes…'
      : '> Skipped — moving to next step.';
    setLogs((prev) => [...prev, { text: reply, kind: 'answer' }]);
    setPendingQuestion(null);
    stepIdx.current += 1;
    timeoutRef.current = setTimeout(runStepRef.current, 700);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <GenericPageHeader
        onButtonClick={() => {}}
        buttonText='Execute All Recommendations'
        title='Action Feed'
        description='AI-curated actions to optimise your engineering performance'
      />

      {/* Insights list */}
      <BaseCardWrapper
        paddingDisabled={true}
        children={
          <div className='w-full h-full'>
            {loading && (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4' />
                <p className='text-light-text-secondary dark:text-dark-text-secondary'>
                  Generating insights from your integrations…
                </p>
              </div>
            )}

            {!loading && insights.length === 0 && (
              <div className='text-center py-12'>
                <Zap className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>
                  No Insights Available
                </h3>
                <p className='text-light-text-secondary dark:text-dark-text-secondary'>
                  Connect your first integration in Connectors to start
                  receiving AI-powered insights.
                </p>
              </div>
            )}

            {!loading && insights.length > 0 && (
              <>
                <div className='p-4 border-b border-light-border'>
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
                      <ShieldCheck className='w-4 h-4' />
                      <span className='text-sm'>
                        {filteredInsights.length} AI-curated actions ranked by
                        impact and confidence
                      </span>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='text-xs px-2 py-1 rounded-full bg-cyan-600/20 text-cyan-400'>
                        Based on {connectedConnectors.length} connected
                        integration{connectedConnectors.length !== 1 ? 's' : ''}
                      </span>
                      <select
                        className='px-3 py-2 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border text-xs focus:ring-2 focus:ring-cyan-500'
                        value={actionFilter}
                        onChange={(event) =>
                          setActionFilter(event.target.value)
                        }
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
                </div>
                <div className='p-4 h-[calc(100vh-250px)] overflow-y-auto cards-scroll space-y-4'>
                  {filteredInsights.map((insight) => (
                    <PrescriptiveInsightsCard
                      key={insight.id}
                      insight={insight}
                      isHighPriority={
                        highPriorityByConnector[
                          insight.connectorName?.toLowerCase() ?? 'general'
                        ]?.includes(insight.id) ?? false
                      }
                      onExecute={openExecute}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        }
      />

      {/* Impact simulation + charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <PrescriptiveInsightsImpactSimulationRange />
        <PrescriptiveInsightsImpactSimulationChart />
      </div>

      {/* Feedback loop */}
      <FeedbackLoop />

      {/* ── Execution Modal ── */}
      {activeInsight && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'>
          <div className='w-full max-w-2xl rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl flex flex-col overflow-hidden'>
            {/* Modal header */}
            <div className='px-6 pt-5 pb-4 border-b border-white/10 flex items-center gap-3'>
              <div className='w-9 h-9 rounded-lg bg-cyan-600/20 flex items-center justify-center shrink-0'>
                <Terminal className='w-5 h-5 text-cyan-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='font-semibold text-white text-sm leading-tight truncate'>
                  {activeInsight.title}
                </h2>
                <p className='text-xs text-white/40 mt-0.5'>
                  Profectia AI Agent · Execution Log
                </p>
              </div>
              {isRunning && (
                <div className='flex items-center gap-1.5 text-xs text-emerald-400 shrink-0'>
                  <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                  LIVE
                </div>
              )}
            </div>

            {/* Log terminal — fixed 420 px tall */}
            <div className='px-6 py-5 h-105 overflow-y-auto font-mono text-xs space-y-1.5 bg-black/50 log-scroll'>
              {logs.length === 0 && !isRunning && !isDone && (
                <p className='text-white/25 select-none'>
                  Press Run to start execution…
                </p>
              )}
              {logs.map((line, i) => {
                const { color, icon } = logStyle(line.kind);
                return (
                  <div key={i} className={`flex items-start gap-2.5 ${color}`}>
                    <span className='text-white/25 shrink-0 select-none tabular-nums w-5 text-right'>
                      {String(i + 1).padStart(2, '00')}
                    </span>
                    <span className='shrink-0 select-none w-3'>{icon}</span>
                    <span className='leading-relaxed break-all'>
                      {line.text}
                    </span>
                  </div>
                );
              })}
              {isRunning && !pendingQuestion && (
                <div className='flex items-center gap-2.5 text-white/35 pl-8.5'>
                  <div className='w-3 h-3 border-2 border-white/35 border-t-transparent rounded-full animate-spin shrink-0' />
                  <span>executing…</span>
                </div>
              )}
              {isDone && (
                <div className='flex items-center gap-2.5 text-emerald-400 font-medium pl-8.5 mt-2 pt-3 border-t border-white/5'>
                  <CheckCircle2 className='w-4 h-4 shrink-0' />
                  <span>Execution complete. Action removed from queue.</span>
                </div>
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Modal footer — adapts to: question / running / done */}
            <div className='px-6 py-4 border-t border-white/10'>
              {pendingQuestion ? (
                /* Yes / No prompt */
                <div className='flex items-center justify-between gap-4'>
                  <p className='text-xs flex-1 min-w-0'>
                    <span className='text-white/40 mr-1.5'>AI is asking:</span>
                    <span className='text-cyan-300'>{pendingQuestion}</span>
                  </p>
                  <div className='flex gap-2 shrink-0'>
                    <button
                      onClick={() => answerQuestion(false)}
                      className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 text-sm transition-colors cursor-pointer'
                    >
                      No
                    </button>
                    <button
                      onClick={() => answerQuestion(true)}
                      className='px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-colors cursor-pointer'
                    >
                      Yes
                    </button>
                  </div>
                </div>
              ) : !isDone ? (
                /* Run / Cancel */
                <div className='flex items-center justify-end gap-3'>
                  <button
                    onClick={closeModal}
                    disabled={isRunning}
                    className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm disabled:opacity-40 transition-colors cursor-pointer'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startExecution}
                    disabled={isRunning}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium disabled:opacity-50 transition-colors cursor-pointer'
                  >
                    {isRunning ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        Running…
                      </>
                    ) : (
                      <>
                        <Zap className='w-4 h-4' /> Run
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Done */
                <div className='flex justify-end'>
                  <button
                    onClick={closeModal}
                    className='px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors cursor-pointer'
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar */}
      <style jsx global>{`
        .cards-scroll::-webkit-scrollbar,
        .log-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .cards-scroll::-webkit-scrollbar-track,
        .log-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
        }
        .cards-scroll::-webkit-scrollbar-thumb,
        .log-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(6, 182, 212, 0.5),
            rgba(16, 185, 129, 0.5)
          );
          border-radius: 10px;
        }
        .cards-scroll::-webkit-scrollbar-thumb:hover,
        .log-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            rgba(6, 182, 212, 0.75),
            rgba(16, 185, 129, 0.75)
          );
        }
      `}</style>
    </div>
  );
}
