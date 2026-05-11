import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import { BarChart3 } from "lucide-react";
import React from "react";

function ResourceBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {label}
        </span>
        <span className="text-sm">{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-light-border dark:bg-dark-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

const StreamHealthResourceUsage = ({
  isRestarting = false,
}: {
  isRestarting?: boolean;
}) => {
  return (
    <BaseCardWrapper
      className={`p-0! relative overflow-hidden ${isRestarting ? "opacity-60 pointer-events-none" : ""}`}
      children={
        <div className={`h-full w-full`}>
          <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between">
            <h3 className="font-medium">Resource Usage</h3>
            <BarChart3 className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
          </div>
          {isRestarting && (
            <div className="py-5 flex items-center justify-center bg-black/50 z-50 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-white">
                  Restarting Resource Usage...
                </p>
              </div>
            </div>
          )}
          {!isRestarting && (
            <>
              <div className="p-4 space-y-4">
                <ResourceBar
                  label="Memory Footprint (6.2GB)"
                  value={68}
                  color="linear-gradient(90deg, #06b6d4, #10b981)"
                />
                <ResourceBar
                  label="AI Token Consumption (1.5M/hr)"
                  value={45}
                  color="linear-gradient(90deg, #22d3ee, #818cf8)"
                />
                <ResourceBar
                  label="Compute Load"
                  value={52}
                  color="linear-gradient(90deg, #10b981, #84cc16)"
                />
              </div>
            </>
          )}
        </div>
      }
    />
  );
};

export default StreamHealthResourceUsage;
