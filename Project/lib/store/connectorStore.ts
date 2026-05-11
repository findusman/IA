import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConnectorId = string;

export type ConnectedConnector = {
  id: ConnectorId;
  name: string;
  subtitle?: string;
  category?: string;
  connectedAt?: string;
  revoked?: boolean;
  revokedAt?: string;
};

export type AuditLogEntry = {
  timestamp: string;
  action: "connected" | "revoked" | "disabled" | "global_revoke";
  connectorName?: string;
  details?: string;
};

interface ConnectorStore {
  connected: ConnectorId[];
  connectedConnectors: ConnectedConnector[];
  auditLog: AuditLogEntry[];
  addConnected: (id: ConnectorId, connector: ConnectedConnector) => void;
  removeConnected: (id: ConnectorId) => void;
  setConnected: (ids: ConnectorId[]) => void;
  setConnectedConnectors: (connectors: ConnectedConnector[]) => void;
  isConnected: (id: ConnectorId) => boolean;
  clearAllConnectors: () => void;
  revokeAllConnectors: () => void;
  setRevokedStatus: (id: ConnectorId, revoked: boolean) => void;
  addAuditLog: (entry: AuditLogEntry) => void;
}

// Get user-specific storage key
const getUserStorageKey = () => {
  if (typeof window === "undefined") return "connector-store";
  const userEmail = localStorage.getItem("profectia_user_email");
  return userEmail ? `connector-store-${userEmail}` : "connector-store";
};

export const useConnectorStore = create<ConnectorStore>()(
  persist(
    (set, get) => ({
      connected: [],
      connectedConnectors: [],
      auditLog: [],

      addConnected: (id: ConnectorId, connector: ConnectedConnector) => {
        set((state) => {
          if (state.connected.includes(id)) {
            return state;
          }
          return {
            connected: [...state.connected, id],
            connectedConnectors: [
              ...state.connectedConnectors,
              {
                ...connector,
                connectedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeConnected: (id: ConnectorId) => {
        set((state) => ({
          connected: state.connected.filter((x) => x !== id),
          connectedConnectors: state.connectedConnectors.filter(
            (c) => c.id !== id,
          ),
        }));
      },

      setConnected: (ids: ConnectorId[]) => {
        set({ connected: ids });
      },

      setConnectedConnectors: (connectors: ConnectedConnector[]) => {
        set({
          connectedConnectors: connectors,
          connected: connectors.map((c) => c.id),
        });
      },

      isConnected: (id: ConnectorId) => {
        return get().connected.includes(id);
      },

      clearAllConnectors: () => {
        set({
          connected: [],
          connectedConnectors: [],
        });
      },

      revokeAllConnectors: () => {
        set((state) => ({
          connectedConnectors: state.connectedConnectors.map((c) => ({
            ...c,
            revoked: true,
            revokedAt: new Date().toISOString(),
          })),
          auditLog: [
            ...state.auditLog,
            {
              timestamp: new Date().toISOString(),
              action: "global_revoke",
              details: `All ${state.connectedConnectors.length} connectors disabled`,
            },
          ],
        }));
      },

      setRevokedStatus: (id: ConnectorId, revoked: boolean) => {
        set((state) => {
          const connector = state.connectedConnectors.find((c) => c.id === id);
          return {
            connectedConnectors: state.connectedConnectors.map((c) =>
              c.id === id
                ? {
                    ...c,
                    revoked,
                    revokedAt: revoked ? new Date().toISOString() : undefined,
                  }
                : c,
            ),
            auditLog: [
              ...state.auditLog,
              {
                timestamp: new Date().toISOString(),
                action: revoked ? "disabled" : "connected",
                connectorName: connector?.name,
                details: revoked ? "Access disabled" : "Access restored",
              },
            ],
          };
        });
      },

      addAuditLog: (entry: AuditLogEntry) => {
        set((state) => ({
          auditLog: [...state.auditLog, entry],
        }));
      },
    }),
    {
      name: "connector-store",
      storage: {
        getItem: () => {
          if (typeof window === "undefined") return null;
          const userStorageKey = getUserStorageKey();
          const item = localStorage.getItem(userStorageKey);
          return item ? JSON.parse(item) : null;
        },
        setItem: (_, value) => {
          if (typeof window === "undefined") return;
          const userStorageKey = getUserStorageKey();
          localStorage.setItem(userStorageKey, JSON.stringify(value));
        },
        removeItem: () => {
          if (typeof window === "undefined") return;
          const userStorageKey = getUserStorageKey();
          localStorage.removeItem(userStorageKey);
        },
      },
    },
  ),
);
