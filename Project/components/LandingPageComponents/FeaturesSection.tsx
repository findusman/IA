'use client';

import React from 'react';
import {
  Network,
  MessageSquare,
  Lightbulb,
  Shield,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

const FEATURES = [
  {
    title: 'Cross-System Correlation Model',
    desc: 'Translates activity across task tracking, code changes, communication, infrastructure usage, and financial transactions into a consistent structure — analysed collectively to reveal hidden patterns.',
    icon: <Network className='w-10 h-10' />,
    color: 'text-purple-400 group-hover:text-cyan-400',
  },
  {
    title: 'Prescriptive Action Engine',
    desc: 'Generates prioritised, specific recommendations based on patterns observed across your systems — not generic rule-based alerts, but insights derived from real cross-system behaviour.',
    icon: <Lightbulb className='w-10 h-10' />,
    color: 'text-cyan-400 group-hover:text-purple-400',
  },
  {
    title: 'Ask Profecia Interface',
    desc: 'Natural language queries answered using your own operational data — specific, accurate, and directly applicable to your environment rather than generic AI responses.',
    icon: <MessageSquare className='w-10 h-10' />,
    color: 'text-green-400 group-hover:text-cyan-400',
  },
  {
    title: 'Continuous Learning',
    desc: 'Insights improve over time as more data is connected and patterns become clearer. Recommendations grow more accurate and tailored to your specific workflows the longer you use the platform.',
    icon: <TrendingUp className='w-10 h-10' />,
    color: 'text-orange-400 group-hover:text-yellow-400',
  },
  {
    title: 'Seamless Integrations',
    desc: 'Connects with your existing tools through secure, user-authorised connections — enhancing current workflows rather than replacing them. No disruption, no migration, no learning curve.',
    icon: <RefreshCw className='w-10 h-10' />,
    color: 'text-pink-400 group-hover:text-purple-400',
  },
  {
    title: 'Privacy & Data Control',
    desc: 'Full UK GDPR compliance. All data access is consent-based. A data minimisation approach ensures only what is necessary is processed. You can disconnect any integration at any time.',
    icon: <Shield className='w-10 h-10' />,
    color: 'text-emerald-400 group-hover:text-cyan-400',
  },
];

const FeaturesSection: React.FC = () => (
  <section id='services' className='py-32 px-6'>
    <div className='max-w-6xl mx-auto'>
      <div className='text-center mb-20'>
        <h2 className='text-5xl md:text-6xl font-bold mb-6'>
          Intelligence Built for{' '}
          <span className='bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'>
            Real Workflows
          </span>
        </h2>
        <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
          Profecia goes beyond dashboards and reporting — it interprets your
          operational data and tells you exactly what to do next.
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all group'
          >
            <div className={`mb-4 transition-colors ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className='text-2xl font-bold mb-3'>{feature.title}</h3>
            <p className='text-gray-400'>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
