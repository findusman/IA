import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import React, { useState } from "react";

const PrescriptiveInsightsImpactSimulationRange = () => {
  const [hireCount, setHireCount] = useState(1);
  return (
    <BaseCardWrapper
      children={
        <div className="w-full h-full">
          <h3 className="font-medium mb-3">Impact Simulations</h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
            If I hire {hireCount} Senior Developer{hireCount > 1 ? "s" : ""}…
          </p>
          <input
            type="range"
            min={0}
            max={3}
            value={hireCount}
            onChange={(e) => setHireCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
              Data lineage’s 30-day
            </span>
            <span className="px-2 py-1 rounded-full text-xs bg-light-border dark:bg-dark-border">
              Data Lineage Map
            </span>
          </div>
        </div>
      }
    />
  );
};

export default PrescriptiveInsightsImpactSimulationRange;
