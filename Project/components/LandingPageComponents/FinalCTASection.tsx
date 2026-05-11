'use client';

import React from 'react';
import { ArrowRight, Lock, Shield, MessageSquare } from 'lucide-react';

interface FinalCTASectionProps {
  onPrimaryAction?: () => void;
}

const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onPrimaryAction,
}) => (
  <section id='cta' className='py-32 px-6'>
    <div className='max-w-4xl mx-auto text-center'>
      <h2 className='text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent'>
        From Reactive to Proactive.
      </h2>

      <p className='text-xl text-gray-400 mb-6 max-w-2xl mx-auto'>
        Stop manually connecting the dots across your systems. Let Profecia
        surface the patterns, recommend the actions, and help you make
        confident decisions — grounded in your own operational data.
      </p>

      <p className='text-lg text-gray-500 mb-12'>
        Available for IT professionals and accountants. Free to get started.
      </p>

      <button
        className='group px-12 py-5 bg-linear-to-r from-purple-600 to-cyan-600 rounded-lg font-bold text-xl hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] transition-all mb-12'
        onClick={onPrimaryAction}
      >
        Get Early Access
        <ArrowRight className='inline ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform' />
      </button>

      <div className='flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500'>
        <div className='flex items-center gap-2'>
          <Shield className='w-4 h-4 text-green-400' />
          <span>UK GDPR compliant</span>
        </div>
        <div className='flex items-center gap-2'>
          <Lock className='w-4 h-4 text-green-400' />
          <span>Your data stays yours</span>
        </div>
        <div className='flex items-center gap-2'>
          <MessageSquare className='w-4 h-4 text-green-400' />
          <span>Ask Profecia anything</span>
        </div>
        <div className='flex items-center gap-2'>
          <Shield className='w-4 h-4 text-green-400' />
          <span>Disconnect anytime</span>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCTASection;
