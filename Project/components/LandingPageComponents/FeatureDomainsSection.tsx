'use client';

import React, { useState } from 'react';
import {
  Code2,
  BookOpen,
  GitBranch,
  Cloud,
  MessageSquare,
  CheckSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  DollarSign,
  RefreshCw,
  BarChart2,
} from 'lucide-react';

const IT_FEATURES = [
  {
    icon: <GitBranch className='w-6 h-6' />,
    title: 'CI/CD Pipeline Intelligence',
    desc: 'Detect inefficiencies in build pipelines and recommend consolidating redundant workflows to reduce build times and improve delivery speed.',
  },
  {
    icon: <AlertCircle className='w-6 h-6' />,
    title: 'PR Review Bottleneck Detection',
    desc: 'Identify pull requests waiting beyond acceptable thresholds and suggest process improvements such as automated reviewer assignment.',
  },
  {
    icon: <Cloud className='w-6 h-6' />,
    title: 'Cloud Resource Optimisation',
    desc: 'Analyse cloud usage trends across AWS, Azure, or GCP and recommend adjustments such as auto-scaling configurations to prevent performance bottlenecks.',
  },
  {
    icon: <CheckSquare className='w-6 h-6' />,
    title: 'Stale Repository Detection',
    desc: 'Detect inactive or stale repositories and recommend archiving them to reduce clutter and improve team focus across your codebase.',
  },
  {
    icon: <MessageSquare className='w-6 h-6' />,
    title: 'Cross-Tool Delay Analysis',
    desc: 'Identify when delivery delays are caused by communication gaps, review bottlenecks, or infrastructure issues — not just code complexity.',
  },
  {
    icon: <BarChart2 className='w-6 h-6' />,
    title: 'Workflow Visibility',
    desc: 'Identify patterns across development platforms, task trackers, and communication tools to surface opportunities for improving team efficiency and engagement.',
  },
];

const ACCOUNTING_FEATURES = [
  {
    icon: <FileText className='w-6 h-6' />,
    title: 'Invoice Cycle Monitoring',
    desc: 'Identify delayed invoice cycles and surface gaps between financial records and operational activity before they impact cash flow management.',
  },
  {
    icon: <AlertCircle className='w-6 h-6' />,
    title: 'Financial Inconsistency Detection',
    desc: 'Highlight inconsistencies in financial workflows and detect patterns that may indicate manual entry errors or process breakdowns across your records.',
  },
  {
    icon: <RefreshCw className='w-6 h-6' />,
    title: 'Manual Process Automation',
    desc: 'Detect repetitive manual processes and suggest opportunities for automation — improving accuracy, compliance, and operational efficiency.',
  },
  {
    icon: <DollarSign className='w-6 h-6' />,
    title: 'Cash Flow Intelligence',
    desc: 'Connect operational activity with financial outcomes to reveal how day-to-day actions — such as delayed client responses — affect payment cycles.',
  },
  {
    icon: <TrendingUp className='w-6 h-6' />,
    title: 'Compliance & Accuracy',
    desc: 'Surface gaps between financial records and operational data early, enabling proactive corrections before compliance issues arise or reports are due.',
  },
  {
    icon: <BarChart2 className='w-6 h-6' />,
    title: 'Workflow Optimisation',
    desc: 'Recommend improvements to financial workflows by analysing patterns across accounting systems, communication channels, and operational data.',
  },
];

const FeatureDomainsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'it' | 'accounting'>('it');

  return (
    <section
      id='domains'
      className='py-32 px-6 bg-linear-to-b from-slate-950/50 to-transparent'
    >
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-5xl md:text-6xl font-bold mb-6'>
            Tailored for Your{' '}
            <span className='bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'>
              Professional Domain
            </span>
          </h2>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            Profecia delivers domain-specific intelligence built around the
            tools and workflows you already rely on — not generic dashboards or
            one-size-fits-all reports.
          </p>
        </div>

        {/* Tab switcher */}
        <div className='flex justify-center mb-12'>
          <div className='bg-white/5 border border-white/10 rounded-2xl p-1 flex gap-1'>
            <button
              onClick={() => setActiveTab('it')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'it'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code2 className='w-5 h-5' />
              IT Professionals
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'accounting'
                  ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className='w-5 h-5' />
              Accountants
            </button>
          </div>
        </div>

        {/* IT Tab */}
        {activeTab === 'it' && (
          <div>
            <div className='flex items-center gap-4 mb-8'>
              <div className='p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl'>
                <Code2 className='w-8 h-8 text-cyan-400' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-cyan-300'>
                  For IT Professionals
                </h3>
                <p className='text-gray-400 text-sm'>
                  Connecting GitHub, Azure DevOps, Jira, Slack, Teams, AWS,
                  Azure, GCP and more
                </p>
              </div>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {IT_FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className='bg-white/5 border border-cyan-500/10 rounded-xl p-6 hover:bg-cyan-950/20 hover:border-cyan-500/30 transition-all'
                >
                  <div className='text-cyan-400 mb-3'>{feature.icon}</div>
                  <h4 className='font-bold mb-2'>{feature.title}</h4>
                  <p className='text-gray-400 text-sm'>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accounting Tab */}
        {activeTab === 'accounting' && (
          <div>
            <div className='flex items-center gap-4 mb-8'>
              <div className='p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl'>
                <BookOpen className='w-8 h-8 text-orange-400' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-orange-300'>
                  For Accountants
                </h3>
                <p className='text-gray-400 text-sm'>
                  Connecting QuickBooks, Xero, Buildium, email, and financial
                  workflow systems
                </p>
              </div>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {ACCOUNTING_FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className='bg-white/5 border border-orange-500/10 rounded-xl p-6 hover:bg-orange-950/20 hover:border-orange-500/30 transition-all'
                >
                  <div className='text-orange-400 mb-3'>{feature.icon}</div>
                  <h4 className='font-bold mb-2'>{feature.title}</h4>
                  <p className='text-gray-400 text-sm'>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureDomainsSection;
