'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import GenericModal from '@/components/GenericComponents/GenericModal';
import GenericPageHeader from '@/components/GenericComponents/GenericPageHeader';
import FeedbackLoop from '@/components/GenericComponents/FeedbackLoop';
import Button from '@/components/BaseComponents/Button';
import StrategicHistroySearchFilter from '@/components/DashboardRoutesComponets/ActionFeedComponents/StrategicHistroySearchFilter';
import StrategicHistoryHistoricalImpactMatrics from '@/components/DashboardRoutesComponets/ActionFeedComponents/StrategicHistoryHistoricalImpactMatrics';
import StrategicHistoryExecutionTimeline from '@/components/DashboardRoutesComponets/ActionFeedComponents/StrategicHistoryExecutionTimeline';

export default function StrategicHistory() {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <GenericPageHeader
        onButtonClick={() => setReportOpen(true)}
        buttonText='Generate Compliance Report'
        // title="Strategic History"
        title='Historical Analysis'
        description='Review past actions and their impact on your business'
      />

      {/* Historical Impact Metrics */}
      <StrategicHistoryHistoricalImpactMatrics />

      {/* Search & Filters Tabs */}
      <StrategicHistroySearchFilter />

      {/* Main grid */}
      <StrategicHistoryExecutionTimeline />

      {/* Feedback Loop */}
      <FeedbackLoop />

      {/* Report Modal */}
      <GenericModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title={
          <div className='flex items-center gap-2'>
            <Download className='w-5 h-5' /> Generate Compliance Report
          </div>
        }
        subtitle='Exports audit trail, model version, and lineage summary.'
      >
        <div className='p-6 space-y-4'>
          <p className='text-sm text-white/80'>
            We will compile actions and outcomes from the selected date range
            with traceability metadata.
          </p>
          <div className='flex justify-end gap-2'>
            <Button variant='secondary' onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button variant='primary' onClick={() => setReportOpen(false)}>
              Export
            </Button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
}
