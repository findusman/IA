'use client';

import React from 'react';
import { Network, MessageSquare, Lightbulb, Shield } from 'lucide-react';

const SolutionSection: React.FC = () => (
  <section
    id='solution'
    className='py-32 px-6 bg-linear-to-b from-purple-950/20 to-transparent'
  >
    <div className='max-w-5xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
          A Unified Decision Layer Across Systems
        </h2>
        <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
          Profecia connects directly to the tools professionals already use and
          transforms fragmented operational data into clear, actionable
          intelligence — without replacing what already works.
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-8 mb-16'>
        <div className='bg-white/5 border border-purple-500/20 rounded-xl p-8'>
          <Network className='w-10 h-10 text-purple-400 mb-4' />
          <h3 className='text-xl font-bold mb-3'>Cross-System Correlation</h3>
          <p className='text-gray-400'>
            Rather than viewing each system in isolation, Profecia analyses how
            activities across development tools, communication platforms, cloud
            infrastructure, and financial systems influence one another —
            detecting patterns invisible to any single tool.
          </p>
        </div>
        <div className='bg-white/5 border border-cyan-500/20 rounded-xl p-8'>
          <Lightbulb className='w-10 h-10 text-cyan-400 mb-4' />
          <h3 className='text-xl font-bold mb-3'>
            Prescriptive Recommendations
          </h3>
          <p className='text-gray-400'>
            Instead of simply presenting data or dashboards, Profecia suggests
            specific actions — such as reorganising workflows, automating
            repetitive tasks, or addressing bottlenecks — based on patterns
            identified across your connected systems.
          </p>
        </div>
        <div className='bg-white/5 border border-green-500/20 rounded-xl p-8'>
          <MessageSquare className='w-10 h-10 text-green-400 mb-4' />
          <h3 className='text-xl font-bold mb-3'>Ask Profecia</h3>
          <p className='text-gray-400'>
            A conversational interface that lets you query your own operational
            data in natural language. Ask how many pull requests are pending,
            where delays are occurring, or how resources are being utilised —
            and receive context-aware answers grounded in your real-time data.
          </p>
        </div>
        <div className='bg-white/5 border border-emerald-500/20 rounded-xl p-8'>
          <Shield className='w-10 h-10 text-emerald-400 mb-4' />
          <h3 className='text-xl font-bold mb-3'>Privacy-First Architecture</h3>
          <p className='text-gray-400'>
            All data access is explicitly authorised by you. Connector data is
            used strictly to generate insights within the platform — never to
            train external AI models, sold to third parties, or used for
            advertising. Disconnect any integration at any time.
          </p>
        </div>
      </div>

      <p className='text-xl text-cyan-300 font-semibold text-center'>
        By providing a unified view across systems and translating complex data
        into clear actions, Profecia enables professionals to move from{' '}
        <span className='text-white'>reactive</span> operations to{' '}
        <span className='text-cyan-400'>proactive, data-driven execution.</span>
      </p>
    </div>
  </section>
);

export default SolutionSection;
