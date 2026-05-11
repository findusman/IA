"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Link2,
  Lock,
  ShieldCheck,
  Sparkles,
  Sparkles as SparklesIcon,
  Users,
  Workflow,
} from "lucide-react";
import GenericModal from "@/components/GenericComponents/GenericModal";

const requestBenefits = [
  "Reduce manual copy-paste between tools",
  "Keep AI recommendations grounded in live operational data",
  "Route insights to the right team automatically",
  "Create a single audit trail for approvals and syncs",
];

const complianceChecks = [
  "Access is limited to the scope you approve",
  "We do not use connector data for ad targeting",
  "We do not train public AI models on your data",
  "Requests are logged for review and auditability",
];

export default function RequestConnectorPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });
  const [connectorName, setConnectorName] = useState("");
  const [connectorUrl, setConnectorUrl] = useState("");
  const [businessNeed, setBusinessNeed] = useState("");
  const [workflowGoal, setWorkflowGoal] = useState("");
  const [priority, setPriority] = useState("High");
  const [syncCadence, setSyncCadence] = useState("Real-time");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const requestSummary = useMemo(
    () => [
      { label: "Estimated setup", value: "15-20 min" },
      { label: "Review type", value: "Light security review" },
      { label: "Tracking", value: "Audit log enabled" },
    ],
    [],
  );

  const closeModal = () => {
    setIsOpen(false);
    router.push("/dashboard/connectors");
  };

  const submitRequest = () => {
    setToast({
      open: true,
      msg: `Your request for ${connectorName || "this connector"} is being reviewed and worked on.`,
    });
    setIsOpen(false);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast({ open: false, msg: "" });
      router.push("/dashboard/connectors");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-light-background via-light-surface to-slate-100 dark:from-dark-background dark:via-dark-surface dark:to-slate-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {toast.open && (
          <div className="fixed right-4 top-4 z-50 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3 animate-in slide-in-from-right-4 slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium">{toast.msg}</span>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Request a Connector
            </h1>
            <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Submit a connector request with the URL, expected workflow
              benefit, and access context.
            </p>
          </div>
        </div>

        <GenericModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex size-12.5 items-center justify-center rounded-xl bg-light-primary/10 dark:bg-dark-primary/10 border border-light-border dark:border-dark-border">
                <Link2 className="h-6 w-6 text-light-primary dark:text-dark-primary" />
              </div>
              <h2 className="text-center text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                Request a New Connector
              </h2>
            </div>
          }
          subtitle="Tell us what tool you want to connect and why it will improve your workflow."
          maxWidth="max-w-5xl"
          contentClassName="bg-light-surface dark:bg-dark-surface"
        >
          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-light-border dark:border-dark-border p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  <Workflow className="h-4 w-4 text-light-primary dark:text-dark-primary" />
                  Connector Details
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                      Connector name
                    </span>
                    <input
                      value={connectorName}
                      onChange={(e) => setConnectorName(e.target.value)}
                      placeholder="e.g. HubSpot, Linear, Greenhouse"
                      className="w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary/70 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                      Connector URL
                    </span>
                    <input
                      value={connectorUrl}
                      onChange={(e) => setConnectorUrl(e.target.value)}
                      placeholder="https://app.vendor.com or https://api.vendor.com"
                      className="w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary/70 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-light-border dark:border-dark-border p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  <SparklesIcon className="h-4 w-4 text-light-primary dark:text-dark-primary" />
                  Why do you need it?
                </div>
                <textarea
                  value={businessNeed}
                  onChange={(e) => setBusinessNeed(e.target.value)}
                  placeholder="Explain the business problem this connector solves. Example: we need live deal updates to route AI alerts to sales ops."
                  className="mt-4 min-h-28 w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary/70 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                />

                <div className="mt-4 rounded-xl bg-light-border/20 dark:bg-dark-border/30 p-4">
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    The stronger the use case, the easier it is for us to
                    justify permissions, set the right sync cadence, and
                    prioritise the integration in the roadmap.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-light-border dark:border-dark-border p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  <Users className="h-4 w-4 text-light-primary dark:text-dark-primary" />
                  Workflow impact
                </div>
                <textarea
                  value={workflowGoal}
                  onChange={(e) => setWorkflowGoal(e.target.value)}
                  placeholder="What should improve after the connector is live? Example: reduce manual reporting, faster escalations, cleaner approvals."
                  className="mt-4 min-h-24 w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary/70 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                />

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                      Priority
                    </span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                      Sync cadence
                    </span>
                    <select
                      value={syncCadence}
                      onChange={(e) => setSyncCadence(e.target.value)}
                      className="w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                    >
                      <option value="Real-time">Real-time</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-light-border dark:border-dark-border p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  <ShieldCheck className="h-4 w-4 text-light-primary dark:text-dark-primary" />
                  Why this helps your workflow
                </div>
                <ul className="mt-4 space-y-3">
                  {requestBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-light-border dark:border-dark-border p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  <Lock className="h-4 w-4 text-light-primary dark:text-dark-primary" />
                  Security & compliance
                </div>
                <ul className="mt-4 space-y-3">
                  {complianceChecks.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-500" />
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-light-border dark:border-dark-border p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  <Clock3 className="h-4 w-4 text-light-primary dark:text-dark-primary" />
                  Request summary
                </div>
                <div className="mt-4 space-y-3">
                  {requestSummary.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {item.label}
                      </span>
                      <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-light-border dark:border-dark-border p-5 bg-linear-to-br from-light-primary/5 to-light-secondary/10 dark:from-dark-primary/10 dark:to-dark-secondary/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-light-primary dark:text-dark-primary mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Looks legit because it is specific
                    </div>
                    <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      A good connector request includes a real URL, a business
                      reason, expected workflow gains, and a clear access
                      posture. That makes review faster and approval easier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-light-border dark:border-dark-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
              Requests are recorded with the connector URL and rationale for
              review.
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={closeModal}
                className="rounded-lg border border-light-border dark:border-dark-border px-4 py-2 text-sm text-light-text-primary dark:text-dark-text-primary hover:border-light-primary dark:hover:border-dark-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary px-4 py-2 text-sm font-medium text-white cursor-pointer"
              >
                Submit Request
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GenericModal>
      </div>
    </div>
  );
}
