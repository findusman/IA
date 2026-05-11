'use client';

import React from 'react';
import { Code2, BookOpen } from 'lucide-react';

const UseCasesSection: React.FC = () => (
  <section
    id='use-cases'
    className='py-32 px-6 bg-linear-to-b from-cyan-950/20 to-transparent'
  >
    <div className='max-w-6xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-5xl md:text-6xl font-bold mb-6'>
          See It in{' '}
          <span className='bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'>
            Action
          </span>
        </h2>
        <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
          Real examples of how Profecia identifies patterns across your
          connected systems and turns them into specific, actionable
          recommendations.
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-16'>
        {/* IT Professionals */}
        <div>
          <div className='flex items-center gap-3 mb-8'>
            <Code2 className='w-10 h-10 text-cyan-400' />
            <h2 className='text-3xl font-bold text-cyan-300'>
              IT Professionals
            </h2>
          </div>
          <ul className='space-y-6'>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                Profecia detects that your CI/CD pipeline has redundant
                workflows running in parallel and recommends consolidating them
                — reducing average build times and freeing up infrastructure
                capacity.
              </p>
            </li>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                Three pull requests have been open for over five days with no
                reviewer activity. Profecia surfaces this pattern and suggests
                enabling automated reviewer assignment based on ownership
                history.
              </p>
            </li>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                Cloud usage trends indicate a recurring spike during business
                hours with no auto-scaling in place. Profecia recommends
                configuration changes to prevent performance degradation during
                peak load.
              </p>
            </li>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                Several repositories have had no commits or activity in over 90
                days. Profecia flags them for review and recommends archiving to
                reduce clutter and improve team focus.
              </p>
            </li>
          </ul>
        </div>

        {/* Accountants */}
        <div>
          <div className='flex items-center gap-3 mb-8'>
            <BookOpen className='w-10 h-10 text-orange-400' />
            <h2 className='text-3xl font-bold text-orange-300'>Accountants</h2>
          </div>
          <ul className='space-y-6'>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-orange-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                Profecia identifies that several invoices have been outstanding
                beyond your standard payment terms and correlates this with
                delayed client communication — recommending follow-up
                prioritisation to improve cash flow.
              </p>
            </li>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-orange-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                A recurring manual data entry process is flagged as a source of
                inconsistencies across your financial records. Profecia
                recommends automating the reconciliation step to reduce errors
                and save time.
              </p>
            </li>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-orange-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                Gaps between operational records and financial data are
                surfaced before month-end close — giving you time to
                investigate and correct discrepancies rather than discovering
                them during the audit.
              </p>
            </li>
            <li className='flex gap-4'>
              <div className='w-2 h-2 bg-orange-400 rounded-full mt-2 shrink-0'></div>
              <p className='text-gray-300'>
                Ask Profecia: &quot;Which clients have outstanding invoices over
                30 days?&quot; — and receive a context-aware answer grounded in
                your actual connected financial data, not a generic response.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default UseCasesSection;
