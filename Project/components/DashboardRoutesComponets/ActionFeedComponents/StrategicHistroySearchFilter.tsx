'use client';

import React, { useState, useMemo } from 'react';
import { useActionStore } from '@/lib/store/actionStore';

const StrategicHistroySearchFilter = () => {
  const [activeTab, setActiveTab] = useState<'Date' | 'Category' | 'Export'>(
    'Date',
  );
  const [exportFormat, setExportFormat] = useState('CSV');
  const [searchTerm, setSearchTerm] = useState('');
  const { actions: insights } = useActionStore();

  const filteredInsights = useMemo(() => {
    if (!searchTerm) return insights;
    return insights.filter(
      (insight) =>
        insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.connectorName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        insight.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [insights, searchTerm]);

  return (
    <div className='rounded-xl p-4 bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <input
          className='flex-1 min-w-56 rounded-lg bg-light-border/60 dark:bg-dark-border/60 p-3 text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary'
          placeholder='Search insights, connectors, or actions'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='flex items-center gap-2'>
          {(['Date', 'Category', 'Export'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                activeTab === tab
                  ? 'bg-linear-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white border-transparent'
                  : 'bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80 border-light-border dark:border-dark-border'
              }`}
            >
              {tab === 'Export' ? 'Export for Audit' : tab}
            </button>
          ))}
          {/* Dropdown to the left of Export */}
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className='px-3 py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-light-text-primary dark:text-dark-text-primary text-sm border border-light-border dark:border-dark-border'
          >
            <option>CSV</option>
            <option>PDF</option>
            <option>JSON</option>
          </select>
        </div>
      </div>
      {searchTerm && (
        <div className='mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          Found {filteredInsights.length} insight
          {filteredInsights.length !== 1 ? 's' : ''} matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default StrategicHistroySearchFilter;
