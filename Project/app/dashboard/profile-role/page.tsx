'use client';
import React, { useMemo, useState } from 'react';
import GenericPageHeader from '@/components/GenericComponents/GenericPageHeader';
import BaseCardWrapper from '@/components/GenericComponents/BaseCardWrapper';
import { CSV_SKILLS } from '@/data/csvSkills';
import {
  Briefcase,
  ChevronDown,
  GaugeCircle,
  Linkedin,
  Lock,
  Settings,
  Sparkles,
  UserCog,
  Users,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clock,
  Download,
  Key,
  Bell,
  Database,
  Zap,
  BarChart3,
} from 'lucide-react';

const roles = [
  'Developer',
  'DevOps Engineer',
  'Database Engineer',
  'SQL Developer',
  'Data Scientist',
  'Data Engineer',
  'CTO',
  'CFO',
  'Head of Engineering',
  'IT Manager',
  'Product Lead',
];
const focusAreas = [
  'Cost Scaling',
  'Speed of Delivery',
  'Compliance',
  'Team Sentiment',
  'DevOps',
];
const insightPriorityDefault = ['DevOps', 'Team Sentiment', 'Reliability'];

// Suggested connectors based on role
const suggestedConnectorsByRole: Record<string, string[]> = {
  CTO: [
    'AWS Cost Explorer',
    'GCP Billing',
    'Azure Cost Management',
    'GitHub',
    'Datadog',
    'PagerDuty',
  ],
  CFO: ['QuickBooks', 'NetSuite', 'Xero', 'Stripe', 'Expensify', 'SAP'],
  'Head of Engineering': [
    'GitHub',
    'Jira',
    'Datadog',
    'PagerDuty',
    'CircleCI',
    'AWS',
  ],
  'IT Manager': [
    'ServiceNow',
    'Jira Service Management',
    'Azure AD',
    'Okta',
    'SentinelOne',
    'CrowdStrike',
  ],
  'Product Lead': [
    'Mixpanel',
    'Amplitude',
    'Segment',
    'FullStory',
    'Pendo',
    'Productboard',
  ],
};

// Suggested connectors based on focus area
const suggestedConnectorsByFocus: Record<string, string[]> = {
  'Cost Scaling': [
    'AWS Cost Explorer',
    'GCP Billing',
    'Azure Cost Management',
    'Kubecost',
    'CloudHealth',
  ],
  'Speed of Delivery': ['GitHub', 'GitLab', 'CircleCI', 'Jenkins', 'Argo CD'],
  Compliance: ['Snyk', 'Qualys', 'Prisma Cloud', 'AWS Config', 'Azure Policy'],
  'Team Sentiment': [
    'Slack',
    'Microsoft Teams',
    'Lattice',
    'Culture Amp',
    'Officevibe',
  ],
  DevOps: ['Datadog', 'PagerDuty', 'Grafana', 'Prometheus', 'Splunk'],
};

// All available connectors
const allConnectors = [
  'GitHub',
  'AWS CloudWatch',
  'Datadog',
  'PagerDuty',
  'Notion',
  'Asana',
  'Jira',
  'Slack',
  'Azure DevOps',
  'CircleCI',
  'GitLab',
  'Snyk',
  'SonarQube',
  'New Relic',
  'Splunk',
  'CloudWatch',
  'GCP',
  'Azure',
  'AWS',
  'QuickBooks',
  'NetSuite',
  'Xero',
  'Stripe',
  'ServiceNow',
  'Okta',
  'CrowdStrike',
];

const suggestedSkillsByRole: Record<string, string[]> = {
  CTO: [
    'Systems Thinking',
    'Cloud Architecture',
    'Engineering Strategy',
    'Cost Optimization',
    'Risk Management',
  ],
  CFO: [
    'FinOps',
    'Forecasting',
    'Vendor Management',
    'Risk Management',
    'Data Literacy',
  ],
  'Head of Engineering': [
    'Technical Leadership',
    'Delivery Management',
    'Platform Engineering',
    'Reliability Engineering',
    'Developer Productivity',
  ],
  'IT Manager': [
    'Service Management',
    'Security Operations',
    'Vendor Management',
    'Asset Management',
    'Incident Response',
  ],
  'Product Lead': [
    'Product Analytics',
    'Customer Discovery',
    'Experiment Design',
    'Roadmapping',
    'Go-to-Market',
  ],
};

const teammates = [
  {
    id: 'john',
    name: '@John_Dev',
    source: 'Slack',
    avatar: '/images/avatar-1.png',
  },
  {
    id: 'jane',
    name: '@Jane_Smith',
    source: 'Gmail',
    avatar: '/images/avatar-2.png',
  },
];

const ProfileRole = () => {
  const [selectedRole, setSelectedRole] = useState<string>(roles[0]);
  const [company, setCompany] = useState<string>('');
  const [workLocation, setWorkLocation] = useState<string>('Remote');
  const [currentProjects, setCurrentProjects] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([
    'Cloud Architecture',
    'Incident Response',
  ]);
  const [skillInput, setSkillInput] = useState<string>('');
  const skillOptions = useMemo(() => Array.from(CSV_SKILLS), []);
  const [skillListOpen, setSkillListOpen] = useState(false);
  const [complexity, setComplexity] = useState<number>(60);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Cost Scaling',
    'Compliance',
  ]);
  const [alertsOnlyHighImpact, setAlertsOnlyHighImpact] =
    useState<boolean>(true);
  const [insightPriority, setInsightPriority] = useState<string[]>(
    insightPriorityDefault,
  );
  const [teamRoutingEnabled, setTeamRoutingEnabled] = useState<boolean>(true);
  const [uploadedFile, setUploadedFile] = useState<string>('');

  const personaSummary = useMemo(
    () => ({
      title: 'AI Persona',
      subtitle: 'Currently optimizing for a Cost-Conscious CTO perspective',
      bullets: [
        'Primary Focus: Cost-level / Strategic',
        'Decision Bias: ROI-driven',
      ],
    }),
    [],
  );

  const toggleFocus = (label: string) => {
    setSelectedFocus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const togglePriority = (label: string) => {
    setInsightPriority((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const addSkill = (valueOverride?: string) => {
    const value = (valueOverride ?? skillInput).trim();
    if (!value) return;
    setSkills((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setSkillInput('');
    setSkillListOpen(false);
  };

  const removeSkill = (label: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== label));
  };

  const suggestedSkills = useMemo(() => {
    const base = suggestedSkillsByRole[selectedRole] ?? [];
    return base.filter((skill) => !skills.includes(skill)).slice(0, 6);
  }, [selectedRole, skills]);

  const filteredSkillOptions = useMemo(() => {
    const query = skillInput.trim().toLowerCase();
    if (!query) return [];
    return skillOptions
      .filter((skill) => skill.toLowerCase().includes(query))
      .filter((skill) => !skills.includes(skill))
      .slice(0, 8);
  }, [skillInput, skillOptions, skills]);

  // Compute suggested connectors based on role and focus area
  const suggestedConnectors = useMemo(() => {
    const roleConnectors = suggestedConnectorsByRole[selectedRole] ?? [];
    // Get unique connectors from all selected focus areas
    const focusConnectors = selectedFocus.flatMap(
      (focus) => suggestedConnectorsByFocus[focus] ?? [],
    );
    // Merge and deduplicate, prioritizing role-based suggestions
    const merged = [...roleConnectors, ...focusConnectors];
    const unique = Array.from(new Set(merged));
    return unique.slice(0, 6);
  }, [selectedRole, selectedFocus]);

  const recalibratePersona = () => {
    // Placeholder action; hook up to backend later

    alert('Recalibrating AI Persona based on current role & focus...');
  };

  return (
    <div className='w-full'>
      <GenericPageHeader
        // title="Profile & Role"
        title='Profile & Role'
        description='Configure your AI persona and role-specific settings'
        buttonText='Recalibrate AI Persona'
        onButtonClick={recalibratePersona}
        buttonIcon={<Sparkles className='w-4 h-4' />}
      />

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Left: Form + Settings */}
        <div className='xl:col-span-2 space-y-6'>
          {/* Work Profile */}
          <BaseCardWrapper className='flex-col'>
            <div className='w-full flex items-center justify-between'>
              <h2 className='text-light-text-primary dark:text-dark-text-primary text-lg font-semibold'>
                Work Profile
              </h2>
              <div className='flex items-center gap-2 text-xs'>
                <Lock className='w-3.5 h-3.5 text-light-text-secondary dark:text-dark-text-secondary' />
                <span className='text-light-text-secondary dark:text-dark-text-secondary'>
                  Private
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='flex items-center gap-2 mb-3'>
                  <Briefcase className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
                  <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                    Company / Organization
                  </span>
                </div>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder='e.g., Profectia Labs'
                  className='w-full bg-transparent rounded-lg border border-light-border dark:border-dark-border px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary'
                />
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='flex items-center gap-2 mb-3'>
                  <Users className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
                  <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                    Work Location
                  </span>
                </div>
                <div className='relative'>
                  <select
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    className='w-full appearance-none bg-transparent rounded-lg border border-light-border dark:border-dark-border px-3 py-2 pr-9 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary'
                  >
                    {['Remote', 'Hybrid', 'On-site', 'Distributed'].map(
                      (loc) => (
                        <option
                          key={loc}
                          value={loc}
                          className='bg-light-surface dark:bg-dark-surface'
                        >
                          {loc}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown className='w-4 h-4 absolute right-3 top-2.5 pointer-events-none text-light-text-secondary dark:text-dark-text-secondary' />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4'>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='flex items-center gap-2 mb-3'>
                  <UserCog className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
                  <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                    Current Role
                  </span>
                </div>
                <div className='relative'>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className='w-full appearance-none bg-transparent rounded-lg border border-light-border dark:border-dark-border px-3 py-2 pr-9 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary'
                  >
                    {roles.map((r) => (
                      <option
                        key={r}
                        value={r}
                        className='bg-light-surface dark:bg-dark-surface'
                      >
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className='w-4 h-4 absolute right-3 top-2.5 pointer-events-none text-light-text-secondary dark:text-dark-text-secondary' />
                </div>
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                    Primary Focus Complexity
                  </span>
                  <span className='text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary'>
                    {complexity}%
                  </span>
                </div>
                <input
                  type='range'
                  min={0}
                  max={100}
                  value={complexity}
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  className='w-full h-2 rounded-lg bg-light-border dark:bg-dark-border'
                  style={{
                    background: `linear-gradient(to right, var(--color-light-primary, #6366f1) 0%, var(--color-light-primary, #6366f1) ${complexity}%, transparent ${complexity}%, transparent 100%)`,
                  }}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4'>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                  Projects in Progress
                </div>
                <textarea
                  value={currentProjects}
                  onChange={(e) => setCurrentProjects(e.target.value)}
                  placeholder='Add projects, initiatives, or squads you are working with...'
                  className='w-full resize-y bg-transparent rounded-lg border border-light-border dark:border-dark-border px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary'
                />
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                  Skills You Have
                </div>
                <div className='flex items-center gap-2'>
                  <div className='relative flex-1'>
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onFocus={() => setSkillListOpen(true)}
                      onBlur={() => {
                        setTimeout(() => setSkillListOpen(false), 120);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder='Add a skill and press Enter'
                      className='w-full bg-transparent rounded-lg border border-light-border dark:border-dark-border px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary'
                    />
                    {skillListOpen && filteredSkillOptions.length > 0 && (
                      <div className='absolute z-20 mt-2 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-lg'>
                        <div className='flex flex-col'>
                          {filteredSkillOptions.map((skill) => (
                            <button
                              key={skill}
                              type='button'
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => addSkill(skill)}
                              className='px-3 py-2 text-left text-xs text-light-text-primary dark:text-dark-text-primary hover:bg-light-border/40 dark:hover:bg-dark-border/40'
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => addSkill()}
                    className='px-3 py-2 rounded-lg text-xs font-semibold bg-linear-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white border border-transparent hover:opacity-90'
                  >
                    Add
                  </button>
                </div>
                <div className='flex flex-wrap gap-2 mt-3'>
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => removeSkill(skill)}
                      className='px-3 py-1 rounded-full text-xs border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-light-primary dark:hover:border-dark-primary'
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4'>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                  Upload Spreadsheet
                </div>
                <label className='block'>
                  <div className='border-2 border-dashed border-light-border dark:border-dark-border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-light-primary dark:hover:border-dark-primary transition-colors'>
                    <Upload className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary mb-2' />
                    <div className='text-center'>
                      <div className='text-xs font-medium text-light-text-primary dark:text-dark-text-primary'>
                        {uploadedFile || 'Click to upload or drag'}
                      </div>
                      <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                        CSV, XLSX, or XLS files
                      </div>
                    </div>
                  </div>
                  <input
                    type='file'
                    accept='.csv,.xlsx,.xls'
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name;
                      if (fileName) setUploadedFile(fileName);
                    }}
                    className='hidden'
                  />
                </label>
                <div className='mt-2 text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                  Enrich your profile with historical data and projects.
                </div>
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                  Suggested Skills to Explore
                </div>
                {suggestedSkills.length === 0 ? (
                  <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                    Your current skills already align with this role.
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {suggestedSkills.map((skill) => (
                      <span
                        key={skill}
                        className='px-3 py-1 rounded-full text-xs border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Focus area chips */}
            <div className='w-full mt-4'>
              <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                Primary Focus Areas
              </div>
              <div className='flex flex-wrap gap-2'>
                {focusAreas.map((fa) => (
                  <button
                    key={fa}
                    onClick={() => toggleFocus(fa)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      selectedFocus.includes(fa)
                        ? 'bg-linear-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white border-transparent'
                        : 'bg-light-border/40 dark:bg-dark-border/40 text-light-text-secondary dark:text-dark-text-secondary border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'
                    }`}
                  >
                    {fa}
                  </button>
                ))}
              </div>
              <div className='mt-3'>
                <button className='inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary bg-light-surface/50 dark:bg-dark-surface/50 hover:border-light-primary dark:hover:border-dark-primary hover:bg-light-surface/70 dark:hover:bg-dark-surface/70'>
                  <Linkedin className='w-4 h-4' />
                  Auto-sync from LinkedIn
                </button>
              </div>
            </div>
          </BaseCardWrapper>

          {/* Role-Based Intelligence (AI Tailoring) */}
          <BaseCardWrapper className='flex-col'>
            <div className='w-full flex items-center justify-between'>
              <h2 className='text-light-text-primary dark:text-dark-text-primary text-lg font-semibold'>
                Role-Based Intelligence (AI Tailoring)
              </h2>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-light-text-primary dark:text-dark-text-primary'>
                  High-Impact Alerts Only
                </span>
                <button
                  onClick={() => setAlertsOnlyHighImpact((v) => !v)}
                  className={`w-12 h-6 rounded-full transition-colors ${alertsOnlyHighImpact ? 'bg-light-primary dark:bg-dark-primary' : 'bg-light-border dark:bg-dark-border'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${alertsOnlyHighImpact ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>

            <div className='mt-4'>
              <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                Insight Priority
              </div>
              <div className='flex flex-wrap gap-2'>
                {[
                  'DevOps',
                  'Team Sentiment',
                  'Security',
                  'Compliance',
                  'Reliability',
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() => togglePriority(label)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      insightPriority.includes(label)
                        ? 'bg-linear-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white border-transparent'
                        : 'bg-light-border/40 dark:bg-dark-border/40 text-light-text-secondary dark:text-dark-text-secondary border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </BaseCardWrapper>

          {/* Role-Based Intelligence (AI Hierarchy) */}
          <BaseCardWrapper className='flex-col'>
            <div className='w-full flex items-center justify-between'>
              <h2 className='text-light-text-primary dark:text-dark-text-primary text-lg font-semibold'>
                Role-Based Intelligence (AI Hierarchy)
              </h2>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-light-text-primary dark:text-dark-text-primary'>
                  My Team
                </span>
                <button
                  onClick={() => setTeamRoutingEnabled((v) => !v)}
                  className={`w-12 h-6 rounded-full transition-colors ${teamRoutingEnabled ? 'bg-light-primary dark:bg-dark-primary' : 'bg-light-border dark:bg-dark-border'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${teamRoutingEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4'>
              {teammates.map((t) => (
                <div
                  key={t.id}
                  className='rounded-lg border border-light-border dark:border-dark-border p-4 flex items-start gap-3'
                >
                  <div className='w-9 h-9 rounded-full bg-light-border dark:bg-dark-border flex items-center justify-center'>
                    <Users className='w-5 h-5' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-sm font-medium'>{t.name}</div>
                    <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                      Reporting Rules: receives relevant insights via {t.source}
                    </div>
                  </div>
                  <button className='px-2.5 py-1 text-xs rounded-md border border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'>
                    Edit
                  </button>
                </div>
              ))}
            </div>

            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                  Automation Rule
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <CheckCircle2 className='w-4 h-4 text-green-500' />
                  Assign AWS-related insights to @John_Dev in Jira automatically
                </div>
              </div>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                  Escalation Rule
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <AlertTriangle className='w-4 h-4 text-amber-500' />
                  CEO receives Executive Summary each Friday
                </div>
              </div>
            </div>
          </BaseCardWrapper>

          {/* Connections, Learning & Progress */}
          <BaseCardWrapper className='flex-col'>
            <div className='w-full flex items-center justify-between'>
              <h2 className='text-light-text-primary dark:text-dark-text-primary text-lg font-semibold'>
                Connectors & Progress
              </h2>
              <button className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'>
                <Settings className='w-4 h-4' /> Manage
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm font-medium mb-2'>
                  Connected Accounts
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-green-500' />
                      <span>Slack</span>
                    </div>
                    <span className='text-xs text-green-500'>Connected</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-green-500' />
                      <span>Gmail</span>
                    </div>
                    <span className='text-xs text-green-500'>Connected</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-green-500' />
                      <span>Jira</span>
                    </div>
                    <span className='text-xs text-green-500'>Connected</span>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm font-medium mb-2'>Last Data Sync</div>
                <div className='space-y-2 text-xs'>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
                    <span className='text-light-text-secondary dark:text-dark-text-secondary'>
                      2 hours ago
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Zap className='w-4 h-4 text-amber-500' />
                    <span>Auto-sync enabled</span>
                  </div>
                  <button className='mt-2 text-light-primary dark:text-dark-primary hover:underline text-xs font-medium'>
                    Sync now
                  </button>
                </div>
              </div>

              {/* Gauge */}
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4 flex items-center justify-between'>
                <div>
                  <div className='text-sm font-medium'>Expertise Score</div>
                  <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                    Learning from connected sources
                  </div>
                </div>
                <div className='relative w-24 h-24'>
                  <div
                    className='absolute inset-0 rounded-full'
                    style={{
                      background:
                        'conic-gradient(#22c55e 0% 92%, #e5e7eb 92% 100%)',
                    }}
                  />
                  <div className='absolute inset-2 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center border border-light-border dark:border-dark-border'>
                    <div className='text-center'>
                      <div className='text-base font-semibold'>92%</div>
                      <div className='text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/30 mt-1'>
                        Expert
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm font-medium mb-2'>Reporting Lines</div>
                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary space-y-2'>
                  <div>CTO → CEO</div>
                  <div className='text-light-primary dark:text-dark-primary text-xs'>
                    ↳ Direct insights to: executive@company.com
                  </div>
                </div>
              </div>
            </div>
          </BaseCardWrapper>

          {/* Available Integrations */}
          <BaseCardWrapper className='flex-col'>
            <div className='w-full flex items-center justify-between'>
              <h2 className='text-light-text-primary dark:text-dark-text-primary text-lg font-semibold'>
                Suggested Integrations
              </h2>
              <button className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary hover:border-light-primary dark:hover:border-dark-primary'>
                <Zap className='w-4 h-4' /> Add
              </button>
            </div>
            <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1 mb-3'>
              Based on your role ({selectedRole}) and focus area
              {selectedFocus.length > 1 ? 's' : ''}: {selectedFocus.join(', ')}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full'>
              {suggestedConnectors.map((connector) => (
                <div
                  key={connector}
                  className='flex items-center justify-between rounded-lg border border-light-border dark:border-dark-border p-3'
                >
                  <span className='text-sm text-light-text-primary dark:text-dark-text-primary'>
                    {connector}
                  </span>
                  <button className='px-2.5 py-1 text-xs rounded-md border border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary hover:border-light-primary dark:hover:border-dark-primary hover:bg-light-primary/5 dark:hover:bg-dark-primary/5'>
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </BaseCardWrapper>

          {/* Privacy & Security */}
          <BaseCardWrapper className='flex-col'>
            <div className='w-full flex items-center justify-between'>
              <h2 className='text-light-text-primary dark:text-dark-text-primary text-lg font-semibold'>
                Privacy & Security
              </h2>
              <Lock className='w-5 h-5 text-light-primary dark:text-dark-primary' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm font-medium mb-3'>API Access</div>
                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                  Manage your API keys for programmatic access.
                </div>
                <button className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary hover:border-light-primary dark:hover:border-dark-primary w-full justify-center'>
                  <Key className='w-4 h-4' /> View Keys
                </button>
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm font-medium mb-3'>Notifications</div>
                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                  Configure how you receive alerts and insights.
                </div>
                <button className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary hover:border-light-primary dark:hover:border-dark-primary w-full justify-center'>
                  <Bell className='w-4 h-4' /> Settings
                </button>
              </div>

              <div className='rounded-lg border border-light-border dark:border-dark-border p-4'>
                <div className='text-sm font-medium mb-3'>Export Data</div>
                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                  Download your profile and insight history.
                </div>
                <button className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary hover:border-light-primary dark:hover:border-dark-primary w-full justify-center'>
                  <Download className='w-4 h-4' /> Export
                </button>
              </div>
            </div>

            <div className='mt-4 rounded-lg bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/30 p-4'>
              <div className='flex gap-3 text-sm'>
                <Lock className='w-5 h-5 text-blue-500 shrink-0 mt-0.5' />
                <div>
                  <div className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                    Enterprise Security
                  </div>
                  <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                    All data is encrypted in transit and at rest. SOC 2 Type II
                    compliant.
                  </div>
                </div>
              </div>
            </div>
          </BaseCardWrapper>
        </div>

        {/* Right: Persona Card */}
        <div className='xl:col-span-1'>
          <div className='rounded-xl p-5 border border-light-primary/40 dark:border-dark-primary/40 bg-light-surface/40 dark:bg-dark-surface/40 shadow-[0_0_0_2px_rgba(99,102,241,0.1)]'>
            <div className='relative rounded-xl p-4 border border-light-primary/30 dark:border-dark-primary/30'>
              <div className='absolute inset-0 rounded-xl ring-2 ring-light-primary/20 dark:ring-dark-primary/20 animate-pulse' />
              <div className='relative z-10'>
                <div className='flex items-center gap-2'>
                  <GaugeCircle className='w-5 h-5 text-light-primary dark:text-dark-primary' />
                  <h3 className='text-light-text-primary dark:text-dark-text-primary font-semibold'>
                    {personaSummary.title}
                  </h3>
                </div>
                <p className='mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                  {personaSummary.subtitle}
                </p>
                <ul className='mt-4 space-y-2'>
                  {personaSummary.bullets.map((b) => (
                    <li key={b} className='flex items-start gap-2 text-sm'>
                      <CheckCircle2 className='w-4 h-4 text-light-primary dark:text-dark-primary mt-0.5' />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='mt-4 rounded-xl p-5 border border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-surface/60'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary'>
                  Profile Completeness
                </div>
                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                  Last updated 2 days ago
                </div>
              </div>
              <div className='text-sm font-semibold text-light-text-primary dark:text-dark-text-primary'>
                68%
              </div>
            </div>
            <div className='mt-3 h-2 rounded-full bg-light-border dark:bg-dark-border overflow-hidden'>
              <div className='h-full rounded-full bg-linear-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary w-[68%]' />
            </div>
            <div className='mt-3 text-xs text-light-text-secondary dark:text-dark-text-secondary'>
              Complete the work profile and add recent projects to unlock more
              tailored insights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRole;
