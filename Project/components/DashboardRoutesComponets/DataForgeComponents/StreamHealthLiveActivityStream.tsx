import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import { PauseCircle, PlayCircle } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useConnectorStore } from "@/lib/store/connectorStore";

type Telemetry = {
  throughput: number; // per second
  latencyMs: number;
  healthScore: number; // percentage
};

const initialTelemetry: Telemetry = {
  throughput: 1240,
  latencyMs: 142,
  healthScore: 99.8,
};

// Event templates for different connectors
const CONNECTOR_EVENTS: Record<string, string[]> = {
  github: [
    "GITHUB: COMMIT_INGESTED - branch:feature/new-api",
    "GITHUB: PULL_REQUEST_OPENED - PR-#245 review ready",
    "GITHUB: ISSUE_CLOSED - resolved security audit",
    "GITHUB: WORKFLOW_COMPLETED - CI/CD pipeline success",
    "GITHUB: CODE_PUSHED - main branch updated",
  ],
  slack: [
    "SLACK: MESSAGE_RECEIVED - #engineering channel",
    "SLACK: USER_MENTION - @team notification",
    "SLACK: FILE_SHARED - document.pdf uploaded",
    "SLACK: REACTION_ADDED - emoji reaction logged",
    "SLACK: CHANNEL_UPDATED - topic changed",
  ],
  jira: [
    "JIRA: TICKET_CREATED - PROJ-542 new task",
    "JIRA: TICKET_UPDATED - PROJ-489 status changed",
    "JIRA: COMMENT_ADDED - discussion on ticket",
    "JIRA: SPRINT_STARTED - sprint-34 initiated",
    "JIRA: ASSIGNEE_CHANGED - reassigned to team",
  ],
  notion: [
    "NOTION: PAGE_CREATED - new documentation",
    "NOTION: DATABASE_UPDATED - entries modified",
    "NOTION: COMMENT_ADDED - page discussion",
    "NOTION: SHARED_ACCESS - user granted access",
    "NOTION: VERSION_SAVED - document versioned",
  ],
  aws: [
    "AWS: INSTANCE_STARTED - ec2-prod-01 online",
    "AWS: LAMBDA_INVOKED - function executed",
    "AWS: S3_UPLOAD - data backed up",
    "AWS: COST_ALERT - budget notification",
    "AWS: AUTO_SCALING - instances adjusted",
  ],
  xero: [
    "XERO: INVOICE_CREATED - INV-2024-001",
    "XERO: PAYMENT_RECEIVED - transaction confirmed",
    "XERO: EXPENSE_LOGGED - receipt processed",
    "XERO: REPORT_GENERATED - financial summary",
    "XERO: RECONCILIATION_COMPLETED - accounts balanced",
  ],
  stripe: [
    "STRIPE: PAYMENT_PROCESSED - charge successful",
    "STRIPE: SUBSCRIPTION_CREATED - customer onboarded",
    "STRIPE: INVOICE_ISSUED - monthly billing",
    "STRIPE: REFUND_REQUESTED - customer refund",
    "STRIPE: PAYOUT_COMPLETED - funds transferred",
  ],
  asana: [
    "ASANA: TASK_CREATED - new work item",
    "ASANA: TASK_ASSIGNED - team member notified",
    "ASANA: PROJECT_UPDATED - milestone reached",
    "ASANA: COMMENT_POSTED - task discussion",
    "ASANA: ATTACHMENT_ADDED - file linked",
  ],
  trello: [
    "TRELLO: CARD_CREATED - new task card",
    "TRELLO: CARD_MOVED - status updated",
    "TRELLO: COMMENT_ADDED - card discussion",
    "TRELLO: CHECKLIST_COMPLETED - tasks finished",
    "TRELLO: LABEL_ADDED - card organized",
  ],
  discord: [
    "DISCORD: MESSAGE_SENT - channel message",
    "DISCORD: USER_JOINED - member online",
    "DISCORD: VOICE_ACTIVE - call in progress",
    "DISCORD: FILE_SHARED - media uploaded",
    "DISCORD: REACTION_ADDED - emoji reaction",
  ],
};

function useLogStream({
  paused,
  verbose,
  connectorNames,
}: {
  paused: boolean;
  verbose: boolean;
  connectorNames: string[];
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (paused || connectorNames.length === 0) return;

    intervalRef.current = setInterval(() => {
      const ts = new Date().toLocaleTimeString();
      const randomConnector =
        connectorNames[Math.floor(Math.random() * connectorNames.length)];
      const connectorKey = randomConnector.toLowerCase().replace(/\s+/g, "");
      const events = CONNECTOR_EVENTS[connectorKey] || [
        `${randomConnector}: EVENT_PROCESSED`,
      ];
      const base = events[Math.floor(Math.random() * events.length)];
      const line = verbose ? `[${ts}] ${base}` : base.split(" - ")[0];
      setLogs((prev) => {
        const next = [...prev, line];
        const maxLogs = connectorNames.length * 15;
        return next.slice(-maxLogs);
      });
    }, 1600);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, verbose, connectorNames]);

  return logs;
}

const StreamHealthLiveActivityStream = ({
  isRestarting = false,
}: {
  isRestarting?: boolean;
}) => {
  const { connectedConnectors } = useConnectorStore();
  const [telemetry, setTelemetry] = useState<Telemetry>(initialTelemetry);
  const [paused, setPaused] = useState(false);
  const [verbose, setVerbose] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);

  const connectorNames = useMemo(
    () => connectedConnectors.map((c) => c.name),
    [connectedConnectors],
  );

  const logs = useLogStream({
    paused: paused || isRestarting,
    verbose,
    connectorNames,
  });

  // Light metric drift to feel alive
  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry((t) => ({
        throughput: Math.max(
          900,
          Math.round(t.throughput + (Math.random() - 0.5) * 40),
        ),
        latencyMs: Math.max(
          80,
          Math.round(t.latencyMs + (Math.random() - 0.5) * 8),
        ),
        healthScore: Math.min(
          100,
          Math.max(
            95,
            Math.round((t.healthScore + (Math.random() - 0.5) * 0.3) * 10) / 10,
          ),
        ),
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <BaseCardWrapper
      className={`p-0! relative overflow-hidden ${isRestarting ? "opacity-60 pointer-events-none" : ""}`}
      children={
        <div className={`h-full w-full`}>
          <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
            <div>
              <h3 className="font-medium">Live Activity Stream</h3>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                {connectorNames.length > 0 ? (
                  <>
                    Monitoring{" "}
                    <strong className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                      {connectorNames.length} connector
                      {connectorNames.length !== 1 ? "s" : ""}
                    </strong>{" "}
                    •{connectorNames.length * 15} logs max
                  </>
                ) : (
                  "No connectors connected - logs will appear here"
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <input
                  type="checkbox"
                  checked={verbose}
                  onChange={(e) => setVerbose(e.target.checked)}
                  className="accent-emerald-500"
                  disabled={isRestarting}
                />
                Toggle Verbosity
              </label>
              <button
                onClick={() => setPaused((p) => !p)}
                disabled={connectorNames.length === 0 || isRestarting}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paused ? (
                  <PlayCircle className="w-5 h-5" />
                ) : (
                  <PauseCircle className="w-5 h-5" />
                )}
                <span>{paused ? "Resume Stream" : "Freeze Stream"}</span>
              </button>
            </div>
          </div>
          {isRestarting && (
            <div className=" py-5 flex items-center justify-center bg-black/50 z-50 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-white">
                  Restarting Live Stream...
                </p>
              </div>
            </div>
          )}
          {!isRestarting && (
            <>
              <div className="p-4 h-112.5 overflow-y-auto font-mono text-sm">
                {connectorNames.length === 0 ? (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Connect connectors from Connectors to see live activity logs
                    here...
                  </p>
                ) : logs.length === 0 ? (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Waiting for events…
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {logs.map((line, idx) => (
                      <li key={idx} className="text-emerald-300/90">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      }
    />
  );
};

export default StreamHealthLiveActivityStream;
