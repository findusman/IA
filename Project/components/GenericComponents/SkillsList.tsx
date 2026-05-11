// components/GenericComponents/SkillsList.tsx
'use client';

import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { getSkillsByCategory } from '@/data/csvSkills';

interface SkillsListProps {
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  category?: 'it' | 'finance' | null;
}

export default function SkillsList({
  selectedSkills,
  onToggleSkill,
  searchValue,
  onSearchChange,
  category = null,
}: SkillsListProps) {
  const categorySkills = useMemo(() => {
    return getSkillsByCategory(category);
  }, [category]);

  const filteredSkills = useMemo(() => {
    return categorySkills.filter(
      (skill) =>
        !selectedSkills.includes(skill) &&
        skill.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [searchValue, selectedSkills, categorySkills]);

  return (
    <div className='w-full'>
      {/* Search Input */}
      <div className='relative mb-4'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none' />
        <input
          type='text'
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search skills...'
          className='
            w-full bg-white/5 border border-white/15 text-white placeholder-white/40 
            pl-12 pr-5 py-3.5 rounded-2xl focus:outline-none focus:border-emerald-500/50 
            focus:ring-2 focus:ring-emerald-500/20 transition-all
          '
        />
      </div>

      {/* Selected Skills Chips */}
      {selectedSkills.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {selectedSkills.map((skill) => (
            <div
              key={skill}
              className='
                inline-flex items-center gap-2 bg-linear-to-r from-emerald-600/30 to-teal-600/20 
                border border-emerald-500/40 text-white px-4 py-2 rounded-full text-sm
              '
            >
              {skill}
              <button
                onClick={() => onToggleSkill(skill)}
                className='hover:bg-white/20 rounded-full p-1 cursor-pointer transition-colors'
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Skills List */}
      <div className='bg-white/5 border border-white/10 rounded-2xl p-5 max-h-64 overflow-y-auto custom-scrollbar'>
        {filteredSkills.length === 0 && searchValue ? (
          <p className='text-white/50 text-sm py-2'>No matching skills found</p>
        ) : (
          <div className='flex flex-wrap gap-2.5'>
            {filteredSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => onToggleSkill(skill)}
                className='
                  px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all
                  bg-white/8 hover:bg-linear-to-r hover:from-emerald-600/40 hover:to-teal-500/30
                  border border-white/15 hover:border-emerald-500/40 hover:text-white
                  text-white/80 hover:shadow-md hover:shadow-emerald-500/20
                '
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info text */}
      <p className='text-white/60 text-xs mt-3'>
        {selectedSkills.length > 0
          ? `${selectedSkills.length} skill${selectedSkills.length === 1 ? '' : 's'} selected`
          : 'Search or select skills to get started'}
      </p>
    </div>
  );
}
