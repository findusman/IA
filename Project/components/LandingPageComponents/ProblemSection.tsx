'use client';

import React from 'react';
import { Code2, BookOpen, Eye, TrendingDown, RefreshCw } from 'lucide-react';

const ProblemSection: React.FC = () => (
  <section id='about' className='py-32 px-6'>
    <div className='max-w-6xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-red-400 to-orange-300 bg-clip-text text-transparent'>
          Fragmented Work. Limited Visibility.
        </h2>
        <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
          Modern professionals operate across multiple disconnected systems. Each
          tool captures only part of the picture — none offer a unified view of
          performance, risks, or opportunities.
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-12 mb-20'>
        {/* IT Professionals */}
        <div className='bg-linear-to-br from-cyan-950/30 to-transparent border border-cyan-500/20 rounded-2xl p-8'>
          <Code2 className='w-12 h-12 text-cyan-400 mb-4' />
          <h3 className='text-2xl font-bold mb-4 text-cyan-300'>
            IT Professionals
          </h3>
          <p className='text-gray-300 leading-relaxed mb-5'>
            Task progress tracked in Jira or Azure DevOps, code activity in
            GitHub, communication in Slack or Teams, infrastructure usage in
            cloud platforms — each system is a silo with no unified view.
          </p>
          <ul className='space-y-3 text-gray-400 text-sm'>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>✗</span>
              Delivery delays span multiple tools — root causes remain hidden
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>✗</span>
              Review bottlenecks and communication gaps go undetected
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>✗</span>
              Infrastructure inefficiencies accumulate without cross-system
              context
            </li>
          </ul>
        </div>

        {/* Accountants */}
        <div className='bg-linear-to-br from-orange-950/30 to-transparent border border-orange-500/20 rounded-2xl p-8'>
          <BookOpen className='w-12 h-12 text-orange-400 mb-4' />
          <h3 className='text-2xl font-bold mb-4 text-orange-300'>
            Accountants
          </h3>
          <p className='text-gray-300 leading-relaxed mb-5'>
            Financial data in QuickBooks or Xero, client communication in email,
            and operational records maintained separately — data exists but
            isn&apos;t connected in a way that reveals financial impact.
          </p>
          <ul className='space-y-3 text-gray-400 text-sm'>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>✗</span>
              Delayed invoice cycles and payment gaps go unnoticed
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>✗</span>
              Manual processes introduce inconsistencies over time
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>✗</span>
              Day-to-day actions&apos; impact on financial outcomes is invisible
            </li>
          </ul>
        </div>
      </div>

      {/* Three core challenges */}
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='text-center p-6 border border-white/10 rounded-xl'>
          <Eye className='w-10 h-10 text-red-400 mx-auto mb-4' />
          <h4 className='text-lg font-bold mb-2 text-red-300'>
            Fragmented Visibility
          </h4>
          <p className='text-gray-400 text-sm'>
            Information is distributed across systems, making it difficult to
            gain a complete understanding of performance or identify root causes.
          </p>
        </div>
        <div className='text-center p-6 border border-white/10 rounded-xl'>
          <TrendingDown className='w-10 h-10 text-orange-400 mx-auto mb-4' />
          <h4 className='text-lg font-bold mb-2 text-orange-300'>
            Unseen Inefficiencies
          </h4>
          <p className='text-gray-400 text-sm'>
            Small delays and process gaps accumulate over time, but remain
            hidden because they span multiple tools and systems.
          </p>
        </div>
        <div className='text-center p-6 border border-white/10 rounded-xl'>
          <RefreshCw className='w-10 h-10 text-yellow-400 mx-auto mb-4' />
          <h4 className='text-lg font-bold mb-2 text-yellow-300'>
            Reactive Workflows
          </h4>
          <p className='text-gray-400 text-sm'>
            Issues are typically identified after they occur, rather than being
            anticipated and addressed proactively before they become costly.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ProblemSection;
