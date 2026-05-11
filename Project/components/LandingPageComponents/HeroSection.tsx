'use client';

import React from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Layers,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

interface HeroSectionProps {
  onPrimaryAction?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onPrimaryAction }) => (
  <section
    id='home'
    className='min-h-screen flex items-center justify-center px-6 pt-20'
  >
    <div className='max-w-6xl w-full'>
      <div className='text-center space-y-8'>
        <div className='inline-block px-4 py-2  mt-10 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-4'>
          <Activity className='inline w-4 h-4 mr-2' />
          Intelligent Workflow Platform
        </div>

        <h1 className='text-6xl md:text-8xl font-bold bg-linear-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent leading-tight'>
          Accelerate Your Workflow at Machine Speed
        </h1>

        <p className='text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto'>
          A unified platform that streamlines operations, removes repetitive
          work, and helps teams execute faster with confidence.
        </p>

        <div className='grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12'>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all'>
            <Zap className='w-8 h-8 text-cyan-400 mb-3' />
            <p className='text-sm text-gray-300'>
              Automate everyday tasks so your team can focus on high-impact
              work.
            </p>
          </div>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all'>
            <TrendingUp className='w-8 h-8 text-purple-400 mb-3' />
            <p className='text-sm text-gray-300'>
              Gain real-time visibility into progress and performance across
              initiatives.
            </p>
          </div>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all'>
            <GitBranch className='w-8 h-8 text-pink-400 mb-3' />
            <p className='text-sm text-gray-300'>
              Connect your tools and workflows in one place for smoother
              collaboration.
            </p>
          </div>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all'>
            <Layers className='w-8 h-8 text-emerald-400 mb-3' />
            <p className='text-sm text-gray-300'>
              Standardize processes with flexible templates your whole team can
              adopt quickly.
            </p>
          </div>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all'>
            <Users className='w-8 h-8 text-orange-300 mb-3' />
            <p className='text-sm text-gray-300'>
              Keep everyone aligned with shared goals, clear ownership, and
              faster handoffs.
            </p>
          </div>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all'>
            <CheckCircle2 className='w-8 h-8 text-blue-300 mb-3' />
            <p className='text-sm text-gray-300'>
              Move from planning to execution with fewer blockers and more
              predictable outcomes.
            </p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-12'>
          <button
            className='LandingPageBtnWithGrdient'
            onClick={onPrimaryAction}
          >
            Start Building Faster
            <ArrowRight className='inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </button>
          <button className='px-6 py-3 border border-white/20 rounded-[100px] font-semibold text-lg hover:bg-white/5 transition-all'>
            Watch 5-Min Demo
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
