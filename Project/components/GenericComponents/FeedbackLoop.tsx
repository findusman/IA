import { Brain, CheckCircle2, XCircle } from "lucide-react";
import React from "react";
import BaseCardWrapper from "./BaseCardWrapper";

const FeedbackLoop = () => {
  return (
    <BaseCardWrapper
      children={
        <div className="w-full">
          <div className="mb-4">
            <h3 className="font-medium mb-3">Feedback Loop</h3>
            <div className="rounded-xl p-3 bg-light-border/60 dark:bg-dark-border/60">
              <div className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" /> Model Notes
              </div>
              <p className="mt-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                Your feedback updates the ranking weights. We prioritize
                cost-saving actions when budget alerts trigger.
              </p>
            </div>
          </div>
          <div className="">
            <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Share your feedback
            </label>
            <textarea
              className="mt-2 w-full h-24 rounded-lg bg-light-border/60 dark:bg-dark-border/60 p-3"
              placeholder="e.g., Stop suggesting AWS optimizations; focus on Xero integrations."
            />
            <div className="mt-3 flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80">
                Send
              </button>
              <span className="inline-flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <CheckCircle2 className="w-4 h-4" /> Positive
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <XCircle className="w-4 h-4" /> Negative
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default FeedbackLoop;
