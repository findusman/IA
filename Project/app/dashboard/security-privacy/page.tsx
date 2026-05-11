"use client";
import React, { useMemo, useState } from "react";
import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import GenericModal from "@/components/GenericComponents/GenericModal";
import {
  ShieldCheck,
  FileDown,
  ScrollText,
  Lock,
  Cloud,
  CircleDot,
  Eye,
  EyeOff,
  Power,
  CheckCircle2,
  ChevronRight,
  Link,
} from "lucide-react";
import {
  useConnectorStore,
  ConnectedConnector,
} from "@/lib/store/connectorStore";
import { getConnectorIcon } from "@/lib/utils/connectorIconUtils";
import { samples } from "@/data/ChartsData";

const SecurityPrivacy = () => {
  const [auditEnabled, setAuditEnabled] = useState<boolean>(false);
  const [killSwitchArmed, setKillSwitchArmed] = useState<boolean>(false);

  const anonymizationStats = useMemo(
    () => ({ totalPII: 4582, bars: [70, 55, 40, 25] }),
    [],
  );

  // use connected connectors from the global store
  const {
    connectedConnectors,
    setConnectedConnectors,
    clearAllConnectors,
    revokeAllConnectors,
  } = useConnectorStore();

  type ExtendedConnectedConnector = ConnectedConnector & { rules?: string[] };

  // Local modal state for editing connector rules (reuses sample items)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editActive, setEditActive] = useState<string | null>(null);
  const [editRules, setEditRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState("");
  // Kill switch confirmation state
  const [isKillConfirmOpen, setIsKillConfirmOpen] = useState(false);
  const [killProcessing, setKillProcessing] = useState(false);
  const [killConfirmText, setKillConfirmText] = useState("");
  const [revokeMode, setRevokeMode] = useState<"soft" | "global">("soft");

  // Toast for feedback
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });

  const getDefaultSampleItems = (
    connectorName: string,
    connectorId?: string,
  ) => {
    const key = connectorName.toLowerCase().replace(/\s+/g, "");
    const pool = samples[key] || [
      "Primary Workspace",
      "Team Resources",
      "Data Repository",
      "Reports & Analytics",
      "Configuration Center",
      "Archive & Logs",
    ];
    if (connectorId) return [...pool];
    return pool.slice(0, 4);
  };

  const openEdit = (id: string) => {
    const connector = (connectedConnectors || []).find(
      (c: ExtendedConnectedConnector) => c.id === id,
    ) as ExtendedConnectedConnector | undefined;
    setEditActive(id);
    setEditRules(
      connector?.rules ||
        getDefaultSampleItems(connector?.name || "").slice(0, 2),
    );
    setNewRule("");
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    if (!editActive) return;
    const updated = (connectedConnectors || []).map((c: ConnectedConnector) =>
      c.id === editActive
        ? ({ ...c, rules: editRules } as ConnectedConnector)
        : c,
    );
    setConnectedConnectors(updated as ConnectedConnector[]);
    setIsEditOpen(false);
    setEditActive(null);
  };

  const addRule = () => {
    const trimmed = newRule.trim();
    if (!trimmed) return;
    if (!editRules.includes(trimmed)) setEditRules((s) => [...s, trimmed]);
    setNewRule("");
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="w-full mb-6 flex items-center justify-between">
        {/* here we have also display subheading acc to content because we have aslo same heading at header */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-cyan-400">
            Security & Privacy
          </h1>
          <p className="text-slate-400">
            Manage your data protection and privacy settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm border border-light-border  hover:border-light-primary dark:hover:border-dark-primary">
            <FileDown className="w-4 h-4" />
            Download DPIA
          </button>
          <button className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg text-sm bg-light-border/60 dark:bg-dark-border/60 hover:bg-light-border dark:hover:bg-dark-border">
            <ScrollText className="w-4 h-4" />
            Audit Logs
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Compliance Shield */}
        <BaseCardWrapper className="flex-col">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <h2 className="text-light-text-primary dark:text-dark-text-primary text-lg font-semibold">
                Real-Time Compliance Shield
              </h2>
            </div>
            <div className="px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-500 border border-green-500/30">
              ACTIVE
            </div>
          </div>

          {/* Edit Rules Modal */}
          <GenericModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            title={
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center">
                  {editActive && (
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getConnectorIcon(
                        (
                          connectedConnectors.find(
                            (x: ConnectedConnector) => x.id === editActive,
                          ) || { name: "" }
                        ).name,
                        32,
                      )}
                    </div>
                  )}
                </div>
                <div className="text-center font-semibold">
                  {connectedConnectors.find(
                    (x: ConnectedConnector) => x.id === editActive,
                  )?.name || "Connector"}
                </div>
              </div>
            }
            // subtitle={`Edit connector rules`}
          >
            <div className="p-4 space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Rules</div>
                <div className="flex flex-wrap gap-2">
                  {editRules.length === 0 && (
                    <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      No rules configured
                    </div>
                  )}
                  {editRules.map((r) => (
                    <div
                      key={r}
                      className="px-2 py-1 rounded-md bg-light-border/60 dark:bg-dark-border/60 flex items-center gap-2 text-xs"
                    >
                      <span>{r}</span>
                      <button
                        onClick={() =>
                          setEditRules((s) => s.filter((x) => x !== r))
                        }
                        className="ml-1 text-xs cursor-pointer text-light-text-secondary dark:text-dark-text-secondary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add custom rule (e.g., Exclude Private DMs)"
                  className="flex-1 px-3 py-2 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border  text-sm"
                />
                <button
                  onClick={addRule}
                  className="px-3 py-2 cursor-pointer rounded-lg bg-cyan-600 text-white text-sm"
                >
                  Add
                </button>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Suggested items</div>
                <div className="flex flex-wrap gap-2">
                  {getDefaultSampleItems(
                    (
                      connectedConnectors.find(
                        (x: ConnectedConnector) => x.id === editActive,
                      ) || { name: "" }
                    ).name || "",
                    editActive || undefined,
                  ).map((it) => (
                    <label
                      key={it}
                      className={`px-3 py-1.5 flex items-center justify-center gap-1 cursor-pointer rounded-md text-xs border ${editRules.includes(it) ? "bg-cyan-500/10 border-cyan-400" : "bg-light-border/60 dark:bg-dark-border/60"}`}
                    >
                      <input
                        type="checkbox"
                        checked={editRules.includes(it)}
                        onChange={() =>
                          setEditRules((s) =>
                            s.includes(it)
                              ? s.filter((x) => x !== it)
                              : [...s, it],
                          )
                        }
                        className="mr-2"
                      />
                      {it}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 cursor-pointer py-2 rounded-lg bg-light-border dark:bg-dark-border"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 cursor-pointer rounded-lg bg-cyan-600 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </GenericModal>

          <div className="mt-4 flex items-center gap-6 w-full">
            {/* Gauge */}
            <div className="relative w-28 h-28">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#22c55e 0% 98%, #e5e7eb 98% 100%)",
                }}
              />
              <div className="absolute inset-2 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center border border-light-border ">
                <div className="text-center">
                  <div className="text-base font-semibold">98%</div>
                  <div className="text-[10px]">Compliant</div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-green-500" />
                <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/30">
                  AES-256 Bit Encryption: ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Cloud className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                Data Hosted in London, UK — AWS eu-west-2
              </div>
            </div>
          </div>
        </BaseCardWrapper>

        {/* Kill Switch Confirmation Modal */}
        <GenericModal
          isOpen={isKillConfirmOpen}
          onClose={() => {
            if (!killProcessing) setIsKillConfirmOpen(false);
          }}
          title={
            <div className="text-center font-semibold text-lg">
              Revoke Access
            </div>
          }
          subtitle={
            revokeMode === "global"
              ? "EMERGENCY MODE — This action cannot be undone"
              : "Disable access to all connectors"
          }
        >
          <div className="p-4 space-y-4">
            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRevokeMode("soft")}
                className={`p-3 rounded-lg border-2 cursor-pointer text-sm font-medium transition-all ${
                  revokeMode === "soft"
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-light-border  hover:border-light-primary"
                }`}
              >
                <div className="font-semibold">Disable Access</div>
                <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary cursor-pointer mt-1">
                  Soft revoke — preserves metadata
                </div>
              </button>
              <button
                onClick={() => setRevokeMode("global")}
                className={`p-3 rounded-lg border-2 text-sm font-medium cursor-pointer transition-all ${
                  revokeMode === "global"
                    ? "border-red-500 bg-red-500/10"
                    : "border-light-border  hover:border-light-primary"
                }`}
              >
                <div className="font-semibold">Global Revoke</div>
                <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  Emergency — clears all
                </div>
              </button>
            </div>

            {/* Impact summary */}
            <div className="rounded-lg bg-light-surface/30 dark:bg-dark-surface/30 border border-light-border  p-3">
              <div className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Impact
              </div>
              <div className="text-sm font-semibold mt-1">
                {connectedConnectors.length} connector
                {connectedConnectors.length !== 1 ? "s" : ""}
              </div>
              {revokeMode === "global" && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                  ⚠ All connector data will be cleared. This cannot be reversed.
                </div>
              )}
              {revokeMode === "soft" && (
                <div className="text-xs text-cyan-600 dark:text-cyan-400 mt-2">
                  ✓ Connectors will be marked as disabled. You can restore
                  access later.
                </div>
              )}
            </div>

            {/* Confirmation text */}
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Type{" "}
              <span className="font-semibold">
                {revokeMode === "global" ? "REVOKE" : "DISABLE"}
              </span>{" "}
              to confirm
            </div>
            <input
              value={killConfirmText}
              onChange={(e) => setKillConfirmText(e.target.value)}
              placeholder={`Type ${revokeMode === "global" ? "REVOKE" : "DISABLE"} to confirm`}
              className="w-full px-3 py-2 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border "
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsKillConfirmOpen(false)}
                disabled={killProcessing}
                className="px-4 py-2 rounded-lg bg-light-border cursor-pointer dark:bg-dark-border"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const expectedText =
                    revokeMode === "global" ? "REVOKE" : "DISABLE";
                  if (killConfirmText !== expectedText) return;
                  setKillProcessing(true);
                  setTimeout(() => {
                    if (revokeMode === "global") {
                      clearAllConnectors();
                      setKillSwitchArmed(true);
                      setToast({
                        open: true,
                        msg: "All connector access permanently revoked (Emergency mode)",
                      });
                    } else {
                      revokeAllConnectors();
                      setToast({
                        open: true,
                        msg: `${connectedConnectors.length} connector${connectedConnectors.length !== 1 ? "s" : ""} access disabled`,
                      });
                    }
                    setKillProcessing(false);
                    setIsKillConfirmOpen(false);
                    setTimeout(() => setToast({ open: false, msg: "" }), 3000);
                    setKillConfirmText("");
                  }, 900);
                }}
                className={`px-4 py-2 cursor-pointer rounded-lg text-white ${
                  killConfirmText ===
                  (revokeMode === "global" ? "REVOKE" : "DISABLE")
                    ? revokeMode === "global"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={
                  killProcessing ||
                  killConfirmText !==
                    (revokeMode === "global" ? "REVOKE" : "DISABLE")
                }
              >
                {killProcessing
                  ? "Processing…"
                  : revokeMode === "global"
                    ? "Confirm Revoke"
                    : "Confirm Disable"}
              </button>
            </div>
          </div>
        </GenericModal>

        {/* Toast */}
        {toast.open && (
          <div className="fixed right-4 top-4 z-50 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium">{toast.msg}</span>
          </div>
        )}

        {/* AI Transparency & Explainability */}
        <BaseCardWrapper className="flex-col">
          <h2 className="text-light-text-primary dark:text-dark-text-primary text-lg font-semibold">
            AI Transparency & Explainability
          </h2>

          <div className="mt-3 grid grid-cols-1 gap-3 w-full">
            <div className="rounded-lg border border-light-border  p-4 flex items-center justify-between">
              <div className="text-sm">
                <div className="text-light-text-secondary dark:text-dark-text-secondary">
                  Model Source Transparency
                </div>
                <div className="font-medium">
                  Llama-3 70B Instruct — Private Instance
                </div>
              </div>
              <div className="px-2 py-1 text-xs rounded-md bg-light-border/60 dark:bg-dark-border/60">
                Private
              </div>
            </div>

            <div className="rounded-lg border border-light-border  p-4">
              <div className="text-sm mb-2 font-medium">
                Data Anonymization Log
              </div>
              <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3">
                {anonymizationStats.totalPII.toLocaleString()} PII points
                scrubbed
              </div>
              <div className="flex items-end gap-2 h-20">
                {anonymizationStats.bars.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-6 rounded bg-red-500/70"
                      style={{ height: `${h}%` }}
                    />
                    <div
                      className="w-6 rounded bg-neutral-500/70"
                      style={{ height: `${Math.max(10, 100 - h)}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  {auditEnabled ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  Show Reasoning Audit (Hidden Prompts)
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">
                    For Admin View Only
                  </span>
                  <button
                    onClick={() => setAuditEnabled((v) => !v)}
                    className={`w-12 h-6 cursor-pointer rounded-full ${auditEnabled ? "bg-light-primary dark:bg-dark-primary" : "bg-light-border dark:bg-dark-border"}`}
                  >
                    <div
                      className="w-5 h-5 bg-white rounded-full transition-transform"
                      style={{
                        transform: `translateX(${auditEnabled ? 24 : 4}px)`,
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </BaseCardWrapper>

        {/* Connector Permissions & Gatekeeper */}
        <BaseCardWrapper className="flex-col">
          <h2 className="text-light-text-primary dark:text-dark-text-primary text-lg font-semibold">
            Connector Permissions & Gatekeeper
          </h2>

          <div className="grid grid-cols-1 gap-3 mt-3 w-full max-h-96 overflow-y-auto">
            {(connectedConnectors || []).length === 0 ? (
              <div className="rounded-lg border border-light-border  p-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                No connected connectors. Connect integrations in{" "}
                <a
                  href="/dashboard/connectors"
                  className="text-blue-500 hover:underline font-bold"
                >
                  Connectors
                </a>
                .
              </div>
            ) : (
              (connectedConnectors || []).map(
                (c: ExtendedConnectedConnector) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-light-border  p-4 w-full"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                        {getConnectorIcon(c.name, 20)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-sm font-medium">{c.name}</div>
                          {c.revoked && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/10 text-red-600 border border-red-500/30 font-medium">
                              Disabled
                            </span>
                          )}
                        </div>
                        {/* Rules display */}
                        <div className="flex flex-wrap gap-2 opacity-60">
                          {c.rules && c.rules.length > 0 ? (
                            c.rules.map((r: string) => (
                              // i have to update the rule style here as well mean its ui
                              <span
                                key={r}
                                className="px-2 py-1 rounded-md text-xs bg-light-border/60 dark:bg-dark-border/60 border border-light-border "
                              >
                                {r}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 rounded-md text-xs text-light-text-secondary dark:text-dark-text-secondary">
                              No rules configured
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.revoked ? (
                          <button
                            onClick={() => {
                              const { setRevokedStatus } =
                                useConnectorStore.getState?.() || {};
                              if (setRevokedStatus)
                                setRevokedStatus(c.id, false);
                            }}
                            className="px-2.5 py-1 text-xs cursor-pointer rounded-md border border-cyan-500/30 text-cyan-600 hover:bg-cyan-500/10"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => openEdit(c.id)}
                            className="px-2.5 py-1 text-xs cursor-pointer rounded-md border border-light-border  hover:border-light-primary dark:hover:border-dark-primary"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                setRevokeMode("global");
                setIsKillConfirmOpen(true);
              }}
              className={`w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold ${
                killSwitchArmed
                  ? "bg-red-600 text-white"
                  : "bg-red-500/90 text-white hover:bg-red-600"
              }`}
            >
              <Power className="w-4 h-4" /> GLOBAL REVOKE (Emergency —
              Immediate)
            </button>
          </div>
        </BaseCardWrapper>

        {/* Privacy-First Learning & Data Flow */}
        <BaseCardWrapper className="flex-col">
          <h2 className="text-light-text-primary dark:text-dark-text-primary text-lg font-semibold">
            Privacy-First Learning & Data Flow
          </h2>

          <div className="mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-green-500/10 text-green-600 border border-green-500/30">
              <CheckCircle2 className="w-4 h-4" /> Zero-Training Guarantee
            </div>
          </div>

          {/* Simple flow diagram */}
          <div className="mt-5 grid grid-cols-3 gap-4 items-center w-full">
            <div className="text-center">
              <div className="rounded-xl border border-light-border  p-4">
                <Cloud className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-xs mt-2">Private Vector Store</div>
            </div>
            <div className="text-center">
              <div className="rounded-xl border border-light-border  p-4">
                <Lock className="w-8 h-8 mx-auto text-amber-500" />
              </div>
              <div className="text-xs mt-2">PII Scrubbing</div>
            </div>
            <div className="text-center">
              <div className="rounded-xl border border-light-border  p-4">
                <ShieldCheck className="w-8 h-8 mx-auto text-green-500" />
              </div>
              <div className="text-xs mt-2">Private Llama-3 AI</div>
            </div>
            <div className="col-span-3 flex items-center justify-center gap-2 mt-2">
              <div className="w-16 h-0.5 bg-linear-to-r from-blue-500 to-amber-500" />
              <ChevronRight className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
              <div className="w-16 h-0.5 bg-linear-to-r from-amber-500 to-green-500" />
            </div>
            <div className="col-span-3 text-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
              Your data NEVER leaves our secure enclave
            </div>
          </div>
        </BaseCardWrapper>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-blue-500">
          <CircleDot className="w-5 h-5" />
          <span className="font-semibold">Profectia.ai</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
