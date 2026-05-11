'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Network,
  Zap,
  Lightbulb,
  History,
  MessageSquare,
  Brain,
  TrendingUp,
  DollarSign,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface MenuItem {
  main: string;
  subs: {
    name: string;
    icon: React.ReactNode;
    path: string;
    description: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    main: 'Mission Control',
    subs: [
      {
        name: 'Executive Summary',
        icon: <LayoutDashboard className='h-5 w-5' />,
        path: '/dashboard/executive-summary',
        description:
          'High-level overview of cross-silo performance and real-time productivity "Pulse."',
      },
      // {
      //   name: "Domain Insights",
      //   icon: <Briefcase className="h-5 w-5" />,
      //   path: "/dashboard/domain-insights",
      //   description:
      //     "Dynamic view tailored to IT/Accounting Personas with industry-specific KPIs.",
      // },
    ],
  },
  {
    main: 'Data Forge',
    subs: [
      {
        name: 'Connectors',
        icon: <Network className='h-5 w-5' />,
        path: '/dashboard/connectors',
        description:
          'Central management for third-party OAuth Connectors (Jira, Xero, GitHub, etc.).',
      },
    ],
  },
  {
    main: 'Action Feed',
    subs: [
      {
        name: 'AI Actions',
        icon: <Lightbulb className='h-5 w-5' />,
        path: '/dashboard/action-feed',
        description:
          'The core AI engine output: Strategic advice following the Observation-Impact-Action logic.',
      },
      {
        name: 'Strategic History',
        icon: <History className='h-5 w-5' />,
        path: '/dashboard/strategic-history',
        description:
          'Archive of past AI recommendations and the recorded impact of user decisions.',
      },
    ],
  },
  {
    main: 'Profecia AI',
    subs: [
      {
        name: 'Ask Profecia',
        icon: <MessageSquare className='h-5 w-5' />,
        path: '/dashboard/ask-profecia',
        description:
          'Context-aware chat interface utilizing RAG to query your unified professional data.',
      },
      // {
      //   name: "Knowledge Base",
      //   icon: <Brain className="h-5 w-5" />,
      //   path: "/dashboard/knowledge-base",
      //   description:
      //     "Repository of learned context regarding user career goals, tech stacks, and habits.",
      // },
    ],
  },
  {
    main: 'Growth & ROI',
    subs: [
      // {
      //   name: "Performance Metrics",
      //   icon: <TrendingUp className="h-5 w-5" />,
      //   path: "/dashboard/performance-metrics",
      //   description:
      //     "Quantifiable data on time saved and efficiency gains driven by AI-prescriptive actions.",
      // },
      // {
      //   name: "Cost Correlation",
      //   icon: <DollarSign className="h-5 w-5" />,
      //   path: "/dashboard/cost-correlation",
      //   description:
      //     "Analysis of business expense vs. tool utility, identifying wasted spend in IT/Accounting.",
      // },
    ],
  },
  {
    main: 'Workspace',
    subs: [
      {
        name: 'Profile & Role',
        icon: <User className='h-5 w-5' />,
        path: '/dashboard/profile-role',
        description:
          'Management of domain expertise (IT/Acc) and professional credential settings.',
      },
      // {
      //   name: "Security & Privacy",
      //   icon: <ShieldCheck className="h-5 w-5" />,
      //   path: "/dashboard/security-privacy",
      //   description:
      //     "GDPR compliance center, data encryption settings, and token management.",
      // },
    ],
  },
];

const suggestions = [
  {
    id: 1,
    icon: Lightbulb,
    text: 'Try AI-powered analysis',
    color: 'text-yellow-400',
    path: '/dashboard/action-feed',
  },
  {
    id: 2,
    icon: Sparkles,
    text: 'Generate content ideas',
    color: 'text-purple-400',
    path: '/dashboard/ask-profecia',
  },
  {
    id: 3,
    icon: TrendingUp,
    text: 'Optimize your workflow',
    color: 'text-blue-400',
    path: '/dashboard/profile-role',
  },
];

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/dashboard/ask-profecia') {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-72' : 'w-0'
      } bg-light-surface dark:bg-dark-surface backdrop-blur-xl border-r border-light-border dark:border-dark-border transition-all duration-300 ease-in-out flex flex-col relative overflow-hidden`}
    >
      <div
        className={`${
          sidebarOpen ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300 flex flex-col h-full`}
      >
        {/* Logo Section */}
        <div className='p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between h-15'>
          <div
            className='flex items-center gap-3
            bg-linear-to-r from-cyan-600 via-emerald-600 to-slate-700 hover:from-cyan-500 hover:via-emerald-500 hover:to-slate-600 text-white  py-2 px-4 rounded-[100px] transition-all shadow-lg shadow-cyan-500/40 hover:shadow-xl cursor-pointer'
          >
            <Brain className='size-5' />
            <h1 className='text-lg font-semibold'>Profectia.ai</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='w-7 h-7 rounded-full bg-light-border dark:bg-dark-border cursor-pointer hover:bg-light-border/80 dark:hover:bg-dark-border/80 flex items-center justify-center transition-all duration-200 hover:scale-110'
          >
            <ChevronLeft className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
          </button>
        </div>

        {/* Menu Items */}
        <nav className='flex-1 p-2 space-y-2 overflow-y-auto'>
          {menuItems.map((item) => (
            <div key={item.main} className='space-y-1 '>
              {/* <div
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-light-text-secondary dark:text-dark-text-secondary bg-light-border/50 dark:bg-dark-border/50"
                >
                  <span className="font-semibold text-sm uppercase tracking-wider">
                    {item.main}
                  </span>
                </div> */}
              <div className='space-y-1 pl-2'>
                {item.subs.map((sub, index) => {
                  const isActive = pathname === sub.path;
                  return (
                    <motion.div
                      key={sub.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.03,
                        ease: 'easeOut',
                      }}
                    >
                      <Link
                        href={sub.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-linear-to-r from-cyan-600 via-emerald-600 to-slate-700 hover:from-cyan-500 hover:via-emerald-500 hover:to-slate-600 text-white'
                            : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border hover:text-light-text-primary dark:hover:text-dark-text-primary'
                        }`}
                      >
                        <motion.div
                          className={`transition-transform duration-200 ${
                            isActive ? '' : 'group-hover:scale-110'
                          }`}
                          whileHover={{ scale: isActive ? 1 : 1.15 }}
                        >
                          {sub.icon}
                        </motion.div>
                        <span className='text-sm font-medium'>{sub.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Request a Connector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href='/dashboard/request-conector'
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border mt-4
                  ${
                    pathname === '/dashboard/request-conector'
                      ? 'bg-linear-to-r from-cyan-600 via-emerald-600 to-slate-700 hover:from-cyan-500 hover:via-emerald-500 hover:to-slate-600 text-white'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border hover:text-light-text-primary dark:hover:text-dark-text-primary border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'
                  }
                `}
            >
              <Network className='w-5 h-5' />
              <span className='text-sm font-medium'>Request a Connector</span>
            </Link>
          </motion.div>
        </nav>

        {/* Suggestions Section */}
        <div className='p-4 border-t border-light-border dark:border-dark-border'>
          <h3 className='text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-3'>
            Suggestions
          </h3>
          <div className='space-y-2'>
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={suggestion.id}
                  onClick={() => router.push(suggestion.path)}
                  className='w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-light-border/50 dark:bg-dark-border/50 hover:bg-light-border dark:hover:bg-dark-border transition-all duration-200 group'
                >
                  <Icon
                    className={`w-4 h-4 ${suggestion.color} transition-transform duration-200 group-hover:scale-110`}
                  />
                  <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors'>
                    {suggestion.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
