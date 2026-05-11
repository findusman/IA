"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileDown, Zap } from "lucide-react";
import {
  StreamHealthResourceUsage,
  StreamHealthConnectivityMatrix,
  StreamHealthLiveActivityStream,
  StreamHealthRealTimeTelemetry,
} from "@/components/DashboardRoutesComponets/DataForgeComponents";

const SAMPLE_EVENTS = [
  "GITHUB: COMMIT_INGESTED - branch:fix/issue-452 [FORGED]",
  "JIRA: ISSUE_VALIDATED - INV-2023-01-Paid [FORGED]",
  "TICKET_UPDATED - PROJ-133 status: In Progress [FORGED]",
  "AWS: COST_ALERT - s3-bucket over_budget +15% [F06]",
  "XERO: TRANSACTION_BUFFER - 24 items queued",
];

function useLogStream({
  paused,
  verbose,
}: {
  paused: boolean;
  verbose: boolean;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (paused) return;

    intervalRef.current = setInterval(() => {
      const ts = new Date().toLocaleTimeString();
      const base =
        SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)];
      const line = verbose ? `[${ts}] ${base}` : base.split(" - ")[0];
      setLogs((prev) => {
        const next = [...prev, line];
        return next.slice(-50);
      });
    }, 1600);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, verbose]);

  return logs;
}

export default function StreamHealthPage() {
  const [paused, setPaused] = useState(false);
  const [verbose, setVerbose] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartNotification, setRestartNotification] = useState<{
    open: boolean;
    status: "loading" | "success";
    message: string;
  }>({
    open: false,
    status: "loading",
    message: "",
  });

  const logs = useLogStream({ paused: paused || isRestarting, verbose });

  const handleExport = async () => {
    setExporting(true);
    const content = logs.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setExporting(false), 300);
  };

  const handleRestartConfirm = () => {
    setIsRestarting(true);
    setRestartNotification({
      open: true,
      status: "loading",
      message: "Restarting Ingestion Engine...",
    });

    setTimeout(() => {
      setIsRestarting(false);
      setPaused(false);
      setRestartNotification({
        open: true,
        status: "success",
        message: "Ingestion Engine restarted successfully",
      });

      setTimeout(
        () => setRestartNotification((prev) => ({ ...prev, open: false })),
        3000,
      );
    }, 3000);
  };

  const totalConnected = 4;
  const healthyStreams = useMemo(
    () => Math.max(1, 4 - Math.floor(Math.random() * 2)),
    [],
  );

  return (
    <div className="space-y-6 p-4">
      {restartNotification.open && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 transition-all ${
            restartNotification.status === "loading"
              ? "bg-cyan-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {restartNotification.status === "loading" ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">{restartNotification.message}</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{restartNotification.message}</span>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          {/* <h2 className="text-2xl font-bold text-cyan-400">
            Stream Health Dashboard
          </h2>
          <p className="text-slate-400">
            Monitor real-time data ingestion and system connectivity.
          </p> */}
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-light-primary text-white hover:opacity-90 dark:bg-dark-primary transition-colors"
        >
          <FileDown className="w-4 h-4" />
          <span>{exporting ? "Exporting…" : "Export System Logs"}</span>
        </button>
      </div>

      <StreamHealthRealTimeTelemetry isRestarting={isRestarting} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StreamHealthLiveActivityStream isRestarting={isRestarting} />
        <div className="space-y-6">
          <StreamHealthConnectivityMatrix isRestarting={isRestarting} />
          <StreamHealthResourceUsage isRestarting={isRestarting} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-2xl bg-slate-900/70 border border-white/10 px-4 py-3 text-sm text-slate-300">
          {healthyStreams}/{totalConnected} streams healthy
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPaused((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            {paused ? "Resume Stream" : "Pause Stream"}
          </button>
          <button
            onClick={() => setVerbose((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            {verbose ? "Compact Logs" : "Verbose Logs"}
          </button>
          <button
            onClick={handleRestartConfirm}
            disabled={isRestarting}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {isRestarting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Restarting…
              </span>
            ) : (
              "Restart Ingestion Engine"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
