import { Activity, CheckCircle2, Gauge, Zap } from "lucide-react";
import React, { useMemo } from "react";
import BaseCardWrapper from "../../GenericComponents/BaseCardWrapper";

function StatCard({
  title,
  value,
  icon,
  suffix,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  suffix?: string;
}) {
  return (
    <BaseCardWrapper>
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {title}
        </p>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-semibold">{value}</span>
          {suffix && (
            <span className="text-light-text-secondary dark:text-dark-text-secondary mb-0.5 text-sm">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </BaseCardWrapper>
  );
}

type Telemetry = {
  throughput: number;
  latencyMs: number;
  healthScore: number;
};

const StreamHealthRealTimeTelemetry = ({
  isRestarting = false,
}: {
  isRestarting?: boolean;
}) => {
  const initialTelemetry: Telemetry = {
    throughput: 1240,
    latencyMs: 142,
    healthScore: 99.8,
  };
  // Derive a stable telemetry snapshot; replace with state if live updates are added
  const telemetry = useMemo(() => initialTelemetry, []);

  return (
    <BaseCardWrapper
      className={`relative overflow-hidden ${isRestarting ? "opacity-60 pointer-events-none" : ""}`}
      children={
        <div className={`h-full w-full`}>
          {isRestarting && (
            <div className="py-5 flex items-center justify-center bg-black/50 z-50 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-white">
                  Restarting Telemetry...
                </p>
              </div>
            </div>
          )}
          {!isRestarting && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Global Through/sec"
                  value={telemetry.throughput}
                  icon={<Zap className="w-5 h-5 text-emerald-500" />}
                />
                <StatCard
                  title="Average Latency"
                  value={telemetry.latencyMs}
                  suffix="ms"
                  icon={<Gauge className="w-5 h-5 text-cyan-500" />}
                />
                <StatCard
                  title="Health Score"
                  value={`${telemetry.healthScore}%`}
                  icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                />
              </div>
            </>
          )}
        </div>
      }
    />
  );
};

export default StreamHealthRealTimeTelemetry;
