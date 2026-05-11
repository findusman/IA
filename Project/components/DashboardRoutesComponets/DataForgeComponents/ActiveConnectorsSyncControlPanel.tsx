import React, { useState } from "react";
import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import { Download, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

const ActiveConnectorsSyncControlPanel = () => {
  const [apiIntegration, setApiIntegration] = useState(true);
  const [badgesDirect, setBadgesDirect] = useState(false);

  return (
    <BaseCardWrapper
      className="p-0!"
      children={
        <div className="h-full w-full ">
          <div className="p-4 border-b border-light-border dark:border-dark-border">
            <h3 className="font-medium">Granular Sync Controls</h3>
          </div>
          <div className="p-4 space-y-5">
            <div>
              <p className="text-sm font-medium mb-2">PII Masking</p>
              <div className="flex items-center justify-between rounded-lg bg-light-border/60 dark:bg-dark-border/60 p-3">
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Enable local AI scrubbing
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setApiIntegration(!apiIntegration)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    apiIntegration ? "bg-blue-500" : "bg-slate-600"
                  }`}
                >
                  <motion.div
                    animate={{ x: apiIntegration ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full"
                  />
                </motion.button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Real-time (Webhook)</p>
              <div className="flex items-center justify-between rounded-lg bg-light-border/60 dark:bg-dark-border/60 p-3">
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Enable streaming updates
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setBadgesDirect(!badgesDirect)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    badgesDirect ? "bg-blue-500" : "bg-slate-600"
                  }`}
                >
                  <motion.div
                    animate={{ x: badgesDirect ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full"
                  />
                </motion.button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Sync Frequency</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Read/Write Permissions: Enabled for Automation
              </p>
              <div className="mt-3 flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-sm hover:bg-light-border/80 dark:hover:bg-dark-border/80">
                  <KeyRound className="w-4 h-4" /> Rotate Keys
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-sm hover:bg-light-border/80 dark:hover:bg-dark-border/80">
                  <Download className="w-4 h-4" /> Download Log
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ActiveConnectorsSyncControlPanel;
