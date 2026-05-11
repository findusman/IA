import BaseCardWrapper from "@/components/GenericComponents/BaseCardWrapper";
import React from "react";

function ActiveConnectorsSummaryCard({
  title,
  value,
  icon,
  action,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <BaseCardWrapper
      children={
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {title}
            </p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
          {action}
        </div>
      }
    />
  );
}

export default ActiveConnectorsSummaryCard;
