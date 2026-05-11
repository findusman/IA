import React from "react";
import { Zap, PlayCircle } from "lucide-react";
import type { Insight } from "@/lib/utils/insightsGenerator";
import { getConnectorIcon } from "@/lib/utils/connectorIconUtils";
function ImpactBar({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <div className="h-2 rounded-full bg-light-border dark:bg-dark-border overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-cyan-400 to-emerald-400"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
        Impact Score: {value}%
      </span>
    </div>
  );
}

const PrescriptiveInsightsCard = ({
  insight,
  isHighPriority,
  onExecute,
}: {
  insight: Insight;
  isHighPriority?: boolean;
  onExecute: (id: string) => void;
}) => {
  return (
    <div className="rounded-2xl p-5 bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-dark-surface flex items-center justify-center">
            {insight.connectorName ? (
              <div className="text-cyan-500 flex items-center justify-center bg-white rounded-full p-1 w-10 h-10">
                {getConnectorIcon(insight.connectorName, 20)}
              </div>
            ) : (
              <Zap className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{insight.title}</h3>
              {isHighPriority && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-rose-500/15 text-rose-500 dark:bg-rose-500/20">
                  High priority
                </span>
              )}
            </div>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {insight.description}
            </p>
          </div>
        </div>
        <div className="text-right w-44 shrink-0">
          <ImpactBar value={insight.impactScore} />
          <p className="text-xs mt-2 text-light-text-secondary dark:text-dark-text-secondary">
            Est. Time Saved: {insight.savings}
          </p>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Confidence: {insight.confidence}%
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onExecute(insight.id)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
        >
          <PlayCircle className="w-4 h-4" /> Execute Now
        </button>
      </div>
    </div>
  );
};

export default PrescriptiveInsightsCard;
