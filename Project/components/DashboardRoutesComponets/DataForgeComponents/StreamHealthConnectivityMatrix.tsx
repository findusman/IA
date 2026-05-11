import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import { Zap } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useConnectorStore } from "@/lib/store/connectorStore";
import { getConnectorIcon } from "@/lib/utils/connectorIconUtils";

type ConnectorHealth = {
  name: string;
  uptime24h: string;
  packetLoss: string;
};

// Generate realistic health metrics based on connector name
const getConnectorHealthMetrics = (
  connectorName: string,
): Omit<ConnectorHealth, "name"> => {
  const metrics: Record<string, Omit<ConnectorHealth, "name">> = {
    xero: { uptime24h: "99.99%", packetLoss: "0.01%" },
    aws: { uptime24h: "99.95%", packetLoss: "0.02%" },
    github: { uptime24h: "99.98%", packetLoss: "0.01%" },
    slack: { uptime24h: "99.97%", packetLoss: "0.02%" },
    jira: { uptime24h: "99.96%", packetLoss: "0.03%" },
    stripe: { uptime24h: "99.99%", packetLoss: "0.01%" },
    quickbooks: { uptime24h: "99.94%", packetLoss: "0.04%" },
    azure: { uptime24h: "99.95%", packetLoss: "0.02%" },
    trello: { uptime24h: "99.97%", packetLoss: "0.02%" },
    datadog: { uptime24h: "99.98%", packetLoss: "0.01%" },
  };

  const key = connectorName.toLowerCase().replace(/\s+/g, "");
  return metrics[key] || { uptime24h: "99.95%", packetLoss: "0.02%" };
};

// Generate unique color for each connector
const getConnectorSparklineColor = (connectorName: string): string => {
  const colors: Record<string, string> = {
    xero: "#10b981", // emerald
    aws: "#f59e0b", // amber
    github: "#6366f1", // indigo
    slack: "#8b5cf6", // violet
    jira: "#06b6d4", // cyan
    stripe: "#ec4899", // pink
    quickbooks: "#14b8a6", // teal
    azure: "#0ea5e9", // sky
    trello: "#f97316", // orange
    datadog: "#a855f7", // purple
    bitbucket: "#06b6d4", // cyan
    microsoft: "#0ea5e9", // sky
    asana: "#10b981", // emerald
  };

  const key = connectorName.toLowerCase().replace(/\s+/g, "");
  const baseColors = Object.values(colors);
  return (
    colors[key] ||
    baseColors[Math.abs(connectorName.charCodeAt(0)) % baseColors.length]
  );
};
function AnimatedSparkline({
  width = 140,
  height = 36,
  color = "#10b981",
  speed = 800,
  id = "sparkline",
}: {
  width?: number;
  height?: number;
  color?: string;
  speed?: number; // ms per tick
  id?: string; // unique id for gradient defs
}) {
  const [ys, setYs] = useState<number[]>(() => {
    const base = Array.from({ length: 24 }, () => Math.random());
    return base.map((v) => height - v * height * 0.85);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setYs((prev) => {
        const last = prev[prev.length - 1];
        const nextY = Math.max(
          2,
          Math.min(height - 2, last + (Math.random() - 0.5) * 6),
        );
        const shifted = prev.slice(1).concat(nextY);
        return shifted;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [speed, height]);

  const points = useMemo(() => {
    return ys.map((y, i) => [(i / (ys.length - 1)) * width, y] as const);
  }, [ys, width]);

  const d = useMemo(() => {
    return points.reduce(
      (acc, [x, y], i) => (i === 0 ? `M ${x},${y}` : acc + ` L ${x},${y}`),
      "",
    );
  }, [points]);

  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>
      <path d={d} stroke={`url(#grad-${id})`} strokeWidth={2} fill="none" />
      {last && <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />}
    </svg>
  );
}

const StreamHealthConnectivityMatrix = ({
  isRestarting = false,
}: {
  isRestarting?: boolean;
}) => {
  const { connectedConnectors } = useConnectorStore();
  const [diagState, setDiagState] = useState<Record<string, boolean>>({});

  const triggerDiagnostic = (name: string) => {
    setDiagState((s) => ({ ...s, [name]: true }));
    setTimeout(() => setDiagState((s) => ({ ...s, [name]: false })), 4000);
  };

  // Transform connected connectors to health data
  const connectorsWithHealth = useMemo(
    () =>
      connectedConnectors.map((c) => ({
        name: c.name,
        ...getConnectorHealthMetrics(c.name),
      })),
    [connectedConnectors],
  );

  return (
    <BaseCardWrapper
      className={`P-0! relative overflow-hidden ${isRestarting ? "opacity-60 pointer-events-none" : ""}`}
      children={
        <div className={`max-h-96 overflow-y-auto w-full`}>
          <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between">
            <h3 className="font-medium">Connectivity Matrix</h3>
            <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
              Uptime (24h)
            </span>
          </div>
          {isRestarting && (
            <div className="py-5 flex items-center justify-center bg-black/50 z-50 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-white">
                  Restarting Connectivity Matrix...
                </p>
              </div>
            </div>
          )}
          {!isRestarting && (
            <>
              <div className="p-4 space-y-4">
                {connectorsWithHealth.length === 0 ? (
                  <div className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
                    {/* i want to add here also the connectors link */}
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      No connected connectors yet. Visit the{" "}
                      <a
                        href="/dashboard/connectors"
                        className="text-blue-500 hover:underline font-bold"
                      >
                        Connectors
                      </a>{" "}
                      to connect your first integration.
                    </p>
                  </div>
                ) : (
                  connectorsWithHealth.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between rounded-xl border border-light-border dark:border-dark-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white  flex items-center justify-center">
                          {getConnectorIcon(c.name, 16)}
                        </div>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            Packet Loss {c.packetLoss}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-full">
                          <AnimatedSparkline
                            id={`spark-${c.name}`}
                            width={240}
                            height={36}
                            color={
                              diagState[c.name]
                                ? "#22d3ee"
                                : getConnectorSparklineColor(c.name)
                            }
                            speed={diagState[c.name] ? 180 : 800}
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{c.uptime24h}</p>
                          <button
                            onClick={() => triggerDiagnostic(c.name)}
                            disabled={isRestarting}
                            className="mt-2 px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-sm hover:bg-light-border/80 dark:hover:bg-dark-border/80 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {diagState[c.name]
                              ? "Diagnosing…"
                              : "Run Diagnostic"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      }
    />
  );
};

export default StreamHealthConnectivityMatrix;
