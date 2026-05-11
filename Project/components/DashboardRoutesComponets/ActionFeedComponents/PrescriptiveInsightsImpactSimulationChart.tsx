import { useEffect, useRef, useState } from "react";
import { LineChart } from "lucide-react";
import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";

const PrescriptiveInsightsImpactSimulationChart = ({
  speed = 700,
  factor = 1,
}: {
  speed?: number;
  factor?: number;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(420);
  const height = 180;
  const [current, setCurrent] = useState<number[]>(() =>
    Array.from({ length: 28 }, () => Math.random()),
  );
  const [prescribed, setPrescribed] = useState<number[]>(() =>
    Array.from({ length: 28 }, () => Math.random()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(
          0.05,
          Math.min(0.95, last + (Math.random() - 0.5) * 0.18 * factor),
        );
        return prev.slice(1).concat(next);
      });
      setPrescribed((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(
          0.05,
          Math.min(0.95, last + (Math.random() - 0.5) * 0.12 * factor),
        );
        return prev.slice(1).concat(next);
      });
    }, speed);

    return () => clearInterval(id);
  }, [speed, factor]);

  // Resize observer for responsive width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setWidth(Math.max(320, Math.floor(cr.width - 24)));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toPoints = (arr: number[]) =>
    arr.map(
      (v, i) =>
        [(i / (arr.length - 1)) * width, height - v * height * 0.8] as const,
    );

  const dPath = (pts: readonly (readonly [number, number])[]) =>
    pts.reduce(
      (acc, [x, y], i) => (i === 0 ? `M ${x},${y}` : acc + ` L ${x},${y}`),
      "",
    );

  const pc = toPoints(current);
  const pp = toPoints(prescribed);
  const lc = pc[pc.length - 1];
  const lp = pp[pp.length - 1];

  return (
    <BaseCardWrapper
      children={
        <div ref={containerRef} className="w-full h-full">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="w-4 h-4" />
            <span className="text-sm font-medium">Impact Simulation</span>
          </div>

          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="grad-current" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="grad-prescribed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>

            <path
              d={dPath(pc)}
              stroke="url(#grad-current)"
              strokeWidth={2}
              fill="none"
            />
            <path
              d={dPath(pp)}
              stroke="url(#grad-prescribed)"
              strokeWidth={2}
              fill="none"
            />

            {lc && <circle cx={lc[0]} cy={lc[1]} r={2.5} fill="#22d3ee" />}
            {lp && <circle cx={lp[0]} cy={lp[1]} r={2.5} fill="#10b981" />}
          </svg>

          <div className="mt-2 flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Current
              Path
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" />{" "}
              Prescribed Path
            </span>
          </div>
        </div>
      }
    />
  );
};

export default PrescriptiveInsightsImpactSimulationChart;
