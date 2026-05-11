// components/auth/steps/Step3_RolesAndSkills.tsx
'use client';

import { useMemo } from 'react';
import {
  Search,
  X,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import SkillsList from '@/components/GenericComponents/SkillsList';
import type { AuthModalStepProps } from '@/types';

export default function Step3RolesAndSkills({
  selectedCategory,
  selectedRoles,
  setSelectedRoles,
  selectedSkills,
  setSelectedSkills,
  roleSearch,
  setRoleSearch,
  skillSearch,
  setSkillSearch,
  handleNext,
  handleBack,
}: AuthModalStepProps & {
  roleSearch: string;
  setRoleSearch: (val: string) => void;
  skillSearch: string;
  setSkillSearch: (val: string) => void;
}) {
  if (!selectedCategory) return null;

  const categoryData = CATEGORIES[selectedCategory];

  // Filtered & available items
  const availableRoles = useMemo(() => {
    return categoryData.roles.filter(
      (role) =>
        !selectedRoles.includes(role) &&
        role.toLowerCase().includes(roleSearch.toLowerCase()),
    );
  }, [categoryData.roles, selectedRoles, roleSearch]);

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
      setRoleSearch(''); // optional: clear search after selection
    }
  };

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
      setSkillSearch('');
    }
  };

  const latestSkillInsight = useMemo(() => {
    if (selectedSkills.length === 0) {
      return 'Select skills to see how AI can supercharge your workflow';
    }

    return `You've selected ${selectedSkills.length} skill${selectedSkills.length === 1 ? '' : 's'}. Keep adding more to unlock advanced AI capabilities!`;
  }, [selectedSkills]);

  const canProceed = selectedRoles.length > 0 && selectedSkills.length > 0;

  return (
    <div className='p-6 md:p-8'>
      <h2 className='text-2xl font-bold text-white mb-2'>
        Tell us about your expertise
      </h2>
      <p className='text-white/70 mb-8 text-sm'>
        Select your roles and key skills to unlock personalized AI capabilities
      </p>

      {/* === ROLES SECTION === */}
      <div className='mb-10'>
        <h3 className='text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2'>
          <div className='w-3 h-3 rounded-full bg-cyan-400'></div>
          Primary Roles
        </h3>

        {/* Search */}
        <div className='relative mb-4'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none' />
          <input
            type='text'
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
            placeholder='Search roles...'
            className='
              w-full bg-white/5 border border-white/15 text-white placeholder-white/40 
              pl-12 pr-5 py-3.5 rounded-2xl focus:outline-none focus:border-cyan-500/50 
              focus:ring-2 focus:ring-cyan-500/20 transition-all
            '
          />
        </div>

        {/* Selected Roles Chips */}
        {selectedRoles.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {selectedRoles.map((role) => (
              <div
                key={role}
                className='
                  inline-flex items-center gap-2 bg-linear-to-r from-cyan-600/30 to-cyan-500/20 
                  border border-cyan-500/40 text-white px-4 py-2 rounded-full text-sm
                '
              >
                {role}
                <button
                  onClick={() => toggleRole(role)}
                  className='hover:bg-white/20 rounded-full p-1 cursor-pointer transition-colors'
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Available Roles */}
        <div className='bg-white/5 border border-white/10 rounded-2xl p-5 max-h-48 overflow-y-auto custom-scrollbar'>
          <div className='flex flex-wrap gap-2.5'>
            {availableRoles.length === 0 && roleSearch ? (
              <p className='text-white/50 text-sm py-2'>
                No matching roles found
              </p>
            ) : (
              availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className='
                    px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all
                    bg-white/8 hover:bg-linear-to-r hover:from-cyan-600/40 hover:to-cyan-500/30
                    border border-white/15 hover:border-cyan-500/40 hover:text-white
                    text-white/80 hover:shadow-md hover:shadow-cyan-500/20
                  '
                >
                  {role}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* === SKILLS SECTION === */}
      <div className='mb-10'>
        <h3 className='text-lg font-semibold text-emerald-300 mb-4 flex items-center gap-2'>
          <div className='w-3 h-3 rounded-full bg-emerald-400'></div>
          Key Skills
        </h3>
        <SkillsList
          selectedSkills={selectedSkills}
          onToggleSkill={(skill) => {
            if (selectedSkills.includes(skill)) {
              setSelectedSkills(selectedSkills.filter((s) => s !== skill));
            } else {
              setSelectedSkills([...selectedSkills, skill]);
              setSkillSearch('');
            }
          }}
          searchValue={skillSearch}
          onSearchChange={setSkillSearch}
          category={selectedCategory as 'it' | 'finance' | null}
        />
      </div>

      {/* === AI INSIGHT BOX === */}
      <div className='bg-linear-to-br from-cyan-900/20 to-emerald-900/20 border border-cyan-500/20 rounded-2xl p-6 mb-10'>
        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 bg-linear-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30'>
            <Brain className='w-7 h-7 text-white' />
          </div>
          <div>
            <h4 className='text-white font-semibold mb-2 flex items-center gap-2'>
              AI Insight
              <Sparkles size={16} className='text-cyan-300' />
            </h4>
            <p className='text-white/80 text-sm leading-relaxed'>
              {latestSkillInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex gap-4'>
        <button
          onClick={handleBack}
          className='
            flex-1 bg-white/5 border cursor-pointer border-white/15 hover:bg-white/10 
            text-white font-medium py-4 px-6 rounded-2xl transition-all 
            flex items-center justify-center gap-2
          '
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            flex-1 py-4 px-6 rounded-2xl font-semibold cursor-pointer transition-all flex items-center justify-center gap-2
            ${
              canProceed
                ? 'bg-linear-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-lg shadow-cyan-500/30'
                : 'bg-white/5 border border-white/15 text-white/40 cursor-not-allowed'
            }
          `}
        >
          Continue
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
