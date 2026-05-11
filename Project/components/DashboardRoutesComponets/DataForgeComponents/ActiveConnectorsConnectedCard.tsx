import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  Database,
  GitBranch,
  Github,
  MoreHorizontal,
  Slack,
} from "lucide-react";

type Connector = {
  name: string;
  vendor: string;
  status: "connected" | "paused" | "error";
  details: string;
  actions: string[];
  icon: React.ReactNode;
};

function StatusBadge({ status }: { status: Connector["status"] }) {
  const map = {
    connected: { text: "Connected", className: "bg-emerald-600" },
    paused: { text: "Paused", className: "bg-yellow-600" },
    error: { text: "Error", className: "bg-red-600" },
  } as const;
  const cfg = map[status];
  return (
    <span
      className={`flex items-center gap-1 px-2 py-0.5 text-xs text-white rounded-full ${cfg.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      {cfg.text}
    </span>
  );
}

function LiveBadge({ live = true }: { live?: boolean }) {
  return (
    <span
      className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
        live ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {live ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      {live ? "LIVE" : "PAUSED"}
    </span>
  );
}

function ActiveConnectorsConnectedCard({ c }: { c: Connector }) {
  return (
    <BaseCardWrapper
      children={
        <div className="w-full">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-light-border/60 dark:bg-dark-border/60 flex items-center justify-center">
                {c.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{c.name}</h4>
                  <StatusBadge status={c.status} />
                  <LiveBadge live={c.status === "connected"} />
                </div>
                {c.vendor && (
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {c.vendor}
                  </p>
                )}
              </div>
            </div>
            <button className="p-1 rounded-full bg-light-border/60 dark:bg-dark-border/60 hover:bg-light-border dark:hover:bg-dark-border">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {c.details}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {c.actions.map((a) => (
              <button
                key={a}
                className="px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-sm hover:bg-light-border/80 dark:hover:bg-dark-border/80"
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
}

export default ActiveConnectorsConnectedCard;
