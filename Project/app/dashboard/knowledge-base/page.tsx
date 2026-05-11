"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  FileText,
  Upload,
  Globe,
  CheckCircle2,
  Network,
  ShieldCheck,
  Trash2,
  Download,
  X,
} from "lucide-react";

type DocItem = {
  id: string;
  name: string;
  type: "pdf" | "json" | "html" | "txt" | "docx";
  sizeMB: number;
  vectorized: boolean;
  lastIndexed?: string;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

function Progress({ value, max }: { value: number; max: number }) {
  // Use fractional percentage so small storage changes are visible
  const pctFloat = Math.min(100, (value / max) * 100);

  return (
    <div className="space-y-2">
      <div className="h-1.5 rounded-full bg-gray-800/50 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${pctFloat.toFixed(2)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs text-gray-400">
        Storage Usage: {value.toFixed(2)} GB / {max} GB
      </div>
    </div>
  );
}

function Badge({
  children,
  variant = "success",
}: {
  children: React.ReactNode;
  variant?: "success" | "pending";
}) {
  const colors = {
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending: "bg-gray-700/50 text-gray-400 border-gray-600/30",
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors[variant]}`}
    >
      {variant === "success" && <CheckCircle2 className="w-3 h-3" />}
      {children}
    </motion.span>
  );
}

function InsightGraph() {
  const width = 400;
  const height = 200;
  const labels = [
    "Cash Flow",
    "Tax Compliance",
    "Hiring Plan",
    "Cloud Infrastructure",
    "Spend",
  ];
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const nodes = [
    { x: 60, y: 80, label: "Cash Flow" },
    { x: 140, y: 40, label: "Tax Compliance" },
    { x: 240, y: 80, label: "Hiring Plan" },
    { x: 180, y: 140, label: "Cloud Infrastructure" },
    { x: 340, y: 100, label: "Spend" },
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [4, 3],
    [1, 3],
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-light-border bg-gray-900/40 backdrop-blur-sm p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Network className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-gray-200">
          Vectorized Insight Map
        </span>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {edges.map(([a, b], idx) => (
          <motion.line
            key={idx}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeOpacity={0.4}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animate ? 1 : 0 }}
            transition={{ duration: 1, delay: idx * 0.1 }}
          />
        ))}
        {nodes.map((n, idx) => (
          <motion.g
            key={idx}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
          >
            <circle cx={n.x} cy={n.y} r={6} fill="#22d3ee" fillOpacity={0.8} />
            <text
              x={n.x + 12}
              y={n.y + 4}
              fontSize={11}
              fill="#e2e8f0"
              className="font-medium"
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-3 text-xs text-gray-400"
      >
        Knowledge Density: 85%
      </motion.div>
    </motion.div>
  );
}

export default function KnowledgeBase() {
  const [docs, setDocs] = useState<DocItem[]>([
    {
      id: "1",
      name: "Q1 Financial Strategy.pdf",
      type: "pdf",
      sizeMB: 18.4,
      vectorized: true,
      lastIndexed: "1h ago",
    },
    {
      id: "2",
      name: "Core API Documentation.json",
      type: "json",
      sizeMB: 6.2,
      vectorized: false,
    },
    {
      id: "3",
      name: "Website_Crawl 2024.html",
      type: "html",
      sizeMB: 12.1,
      vectorized: false,
    },
  ]);

  const [dropActive, setDropActive] = useState(false);
  const [urlToIngest, setUrlToIngest] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const totalGB = docs.reduce((acc, d) => acc + d.sizeMB, 0) / 1024;
  const capGB = 10;
  // start at 0 so the bar animates on initial load
  const [displayGB, setDisplayGB] = useState<number>(0);

  useEffect(() => {
    let rafId: number | null = null;
    const startTime = performance.now();
    const from = displayGB;
    const to = totalGB;
    const duration = 800;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (to - from) * eased;
      setDisplayGB(value);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [totalGB]);

  const markVectorized = (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, vectorized: true, lastIndexed: "just now" } : d,
      ),
    );
  };

  const ingestFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const items: DocItem[] = Array.from(files)
      .slice(0, 5)
      .map((f, i) => ({
        id: `${Date.now()}-${i}`,
        name: f.name,
        type: f.name.toLowerCase().endsWith(".pdf")
          ? "pdf"
          : f.name.toLowerCase().endsWith(".json")
            ? "json"
            : f.name.toLowerCase().endsWith(".html")
              ? "html"
              : f.name.toLowerCase().endsWith(".txt")
                ? "txt"
                : "docx",
        sizeMB: Math.max(0.2, Math.round((f.size / 1024 / 1024) * 10) / 10),
        vectorized: false,
      }));
    setDocs((prev) => [...items, ...prev]);
    setTimeout(() => items.forEach((it) => markVectorized(it.id)), 1200);
  };

  const ingestUrl = () => {
    if (!urlToIngest.trim()) return;
    const item: DocItem = {
      id: `${Date.now()}-url`,
      name: urlToIngest,
      type: "html",
      sizeMB: 3.0,
      vectorized: false,
    };
    setDocs((prev) => [item, ...prev]);
    setUrlToIngest("");
    setTimeout(() => markVectorized(item.id), 900);
  };

  const removeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const wipeMemory = () => {
    setDocs([]);
  };

  const exportGraph = () => {
    const payload = {
      nodes: [
        "Cash Flow",
        "Tax Compliance",
        "Hiring Plan",
        "Cloud Infrastructure",
        "Spend",
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 3],
        [0, 4],
        [4, 3],
        [1, 3],
      ],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knowledge-graph.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1600px] mx-auto space-y-6"
      >
        {/* Alert Banner */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3 backdrop-blur-sm"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200">
            <span className="font-semibold">Knowledge Gap Detected:</span> You
            have 400 GitHub commits for "Project X" but no documentation. Upload
            the README to improve AI context.
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Knowledge Repository */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="rounded-xl border border-light-border bg-gray-900/40 backdrop-blur-sm p-5  flex flex-col max-h-[640px] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">
                Knowledge Repository
              </h3>
              <AnimatePresence mode="popLayout">
                {/* here display a text if there is no docs */}
                {docs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No documents in knowledge base
                    </p>
                  </div>
                )}
                <div className="space-y-3 mb-4">
                  {docs.map((d, index) => (
                    <motion.div
                      key={d.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-lg border border-light-border bg-gray-800/30 p-4 hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="font-medium text-sm text-gray-200 truncate">
                            {d.name}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeDoc(d.id)}
                          className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        {d.vectorized ? (
                          <Badge variant="success">Vectorized</Badge>
                        ) : (
                          <Badge variant="pending">Pending</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        Last Re-indexed: {d.lastIndexed || "—"}
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1.5 rounded-lg cursor-pointer bg-gray-700/50 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          Update Context
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1.5 rounded-lg cursor-pointer bg-gray-700/50 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          View Metadata
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
              <Progress value={displayGB} max={capGB} />
            </div>
          </motion.div>

          {/* Ingestion Zone */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              onDrop={(e) => {
                e.preventDefault();
                setDropActive(false);
                ingestFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDropActive(true);
              }}
              onDragLeave={() => setDropActive(false)}
              animate={{
                borderColor: dropActive ? "#22d3ee" : "rgba(55, 65, 81, 0.5)",
              }}
              className="rounded-xl border-2 border-dashed  border-light-border bg-gray-900/40 backdrop-blur-sm p-5"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-100">
                Ingestion Zone
              </h3>

              {/* Drop Zone */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-xl border border-light-border bg-gray-800/20 p-8 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer"
                onClick={() => fileInput.current?.click()}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Upload className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <div className="text-sm font-medium text-gray-200">
                  Drag & Drop Files
                </div>
                <div className="text-xs text-gray-400">Max 50MB</div>
                <div className="flex items-center gap-2 text-xs flex-wrap justify-center">
                  {["DOCX", "PDF", "JSON", "TXT", "HTML"].map((t) => (
                    <motion.span
                      key={t}
                      whileHover={{ scale: 1.1 }}
                      className="px-2.5 py-1 rounded-md bg-gray-700/50 text-gray-300 border border-gray-600/30"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 px-4 py-2 rounded-lg cursor-pointer bg-gray-700/50 text-sm text-gray-200 hover:bg-gray-700 transition-colors border border-gray-600/30"
                >
                  Browse
                </motion.button>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => ingestFiles(e.target.files)}
                />
              </motion.div>

              {/* URL Scraper & Priority Tagging */}
              <div className="mt-4 space-y-3">
                <div className="rounded-lg bg-gray-800/30 border border-light-border p-4">
                  <div className="flex items-center gap-2 text-sm mb-3 text-gray-200">
                    <Globe className="w-4 h-4 text-cyan-400" /> URL Scraper
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={urlToIngest}
                      onChange={(e) => setUrlToIngest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && ingestUrl()}
                      placeholder="https://example.com/docs"
                      className="flex-1 rounded-lg bg-gray-900/60 border border-light-border px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={ingestUrl}
                      className="px-4 py-2 rounded-lg cursor-pointer bg-gray-700/50 text-sm text-gray-200 hover:bg-gray-700 transition-colors border border-gray-600/30"
                    >
                      Ingest Now
                    </motion.button>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-800/30 border border-light-border p-4">
                  <div className="text-sm mb-3 text-gray-200">
                    Priority Tagging
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-lg cursor-pointer bg-gradient-to-r from-cyan-600 to-emerald-600 text-white text-xs font-medium"
                    >
                      High Importance
                    </motion.button>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSync}
                        onChange={(e) => setAutoSync(e.target.checked)}
                        className="sr-only peer"
                      />
                      <motion.span
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          autoSync
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-700/50 text-gray-300 border border-gray-600/30"
                        }`}
                      >
                        Auto-Sync Folder
                      </motion.span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Ingest Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full px-6 py-3 rounded-lg cursor-pointer bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                Ingest Now
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Graph & Security */}
          <div className="space-y-4">
            <InsightGraph />

            <motion.div
              variants={itemVariants}
              className="rounded-xl border border-light-border bg-gray-900/40 backdrop-blur-sm p-5"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-100">
                Security & Privacy Vault
              </h3>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800/30 border border-light-border"
                >
                  <span className="inline-flex items-center gap-2 text-sm text-gray-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />{" "}
                    Encryption Status
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> AES-256 Active
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="px-4 py-3 rounded-lg bg-gray-800/30 border border-light-border text-sm text-gray-300"
                >
                  Data Scrubbing Log: 1,452 PII entities removed
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="px-4 py-3 rounded-lg bg-gray-800/30 border border-light-border text-sm text-gray-300"
                >
                  Access Control List: Alex T. (Full), Query-Only
                </motion.div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={wipeMemory}
                    className="flex items-center cursor-pointer justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Wipe Memory
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportGraph}
                    className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2.5 rounded-lg bg-gray-700/50 border border-gray-600/30 text-gray-200 hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" /> Export
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
