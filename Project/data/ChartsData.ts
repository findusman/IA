import { Connector, EfficiencyMetric } from '@/types';
export const runwayData = [
  { month: 'Jan', value: 18 },
  { month: 'Feb', value: 47 },
  { month: 'Mar', value: 16 },
  { month: 'Apr', value: 35.5 },
  { month: 'May', value: 24.5 },
  { month: 'Jun', value: 24 },
];

// The Synthesis Graph Data
export const synthesisData = [
  { date: '9/1', devVelocity: 5, cost: 8 },
  { date: '11', devVelocity: 8, cost: 9 },
  { date: '13', devVelocity: 12, cost: 11 },
  { date: '15', devVelocity: 18, cost: 14 },
  { date: '17', devVelocity: 28, cost: 18 },
  { date: '19', devVelocity: 22, cost: 22 },
  { date: '1/1', devVelocity: 15, cost: 28 },
  { date: '3', devVelocity: 10, cost: 35 },
  { date: '5', devVelocity: 8, cost: 38 },
  { date: '7', devVelocity: 6, cost: 32 },
  { date: '9', devVelocity: 5, cost: 25 },
  { date: '2/1', devVelocity: 4, cost: 18 },
  { date: '3', devVelocity: 3, cost: 12 },
  { date: '5', devVelocity: 2, cost: 8 },
  { date: '7', devVelocity: 2, cost: 5 },
  { date: '9', devVelocity: 1, cost: 3 },
  { date: '3/1', devVelocity: 1, cost: 2 },
  { date: 'Aug', devVelocity: 1, cost: 1 },
];

// Metric Cards Data
export const metricCards = [
  {
    id: '1',
    title: 'Open Pull Requests',
    value: '14',
    subtitle: 'Awaiting review',
    badge: '+3 today',
    color: 'from-cyan-500 to-blue-500',
    trend: 'up' as const,
    trendData: [2, 5, 8, 11, 14],
  },
  {
    id: '2',
    title: 'Deployments Today',
    value: '7',
    subtitle: '6 succeeded · 1 failed',
    trend: 'up' as const,
    badge: '+2',
    color: 'from-cyan-500 to-emerald-500',
    trendData: [
      { name: 'Mon', value: 3 },
      { name: 'Tue', value: 5 },
      { name: 'Wed', value: 4 },
      { name: 'Thu', value: 6 },
      { name: 'Fri', value: 7 },
    ],
  },
  {
    id: '3',
    title: 'Sprint Burndown',
    value: '78%',
    subtitle: '4 tasks left',
    trend: 'down' as const,
    badge: '-5%',
    color: 'from-blue-500 to-indigo-500',
    trendData: [
      { day: 'Mon', ideal: 40, actual: 42 },
      { day: 'Tue', ideal: 32, actual: 35 },
      { day: 'Wed', ideal: 24, actual: 28 },
      { day: 'Thu', ideal: 16, actual: 20 },
      { day: 'Fri', ideal: 8, actual: 10 },
    ],
  },
];

// Strategic Action Items Data
export const actionItems = [
  {
    id: 1,
    title: 'Review Stale Pull Requests',
    description:
      'Insight: 5 PRs open for >72 hours with no reviewer assigned (GitHub + Jira).',
    delay: 1.1,
    hasAlert: true,
    hasRedBorder: true,
  },
  {
    id: 2,
    title: 'Address Dev Bottleneck',
    description:
      'Insight: 5 PRs stuck in review for <48 hours (Jira + Slack suggest reassignment).',
    delay: 1.2,
    hasAlert: false,
    hasRedBorder: false,
  },
  {
    id: 3,
    title: 'Fix Failing CI Build',
    description:
      'Insight: api-service pipeline failing for 3 runs · flaky test in step 4 (GitHub Actions).',
    delay: 1.3,
    hasAlert: true,
    hasRedBorder: true,
  },
];

// Technical Debt Index Data
export const technicalDebtData = [
  { name: 'Jan', value: 40, fill: '#3b82f6' },
  { name: 'Feb', value: 70, fill: '#22c55e' },
  { name: 'Mar', value: 30, fill: '#f59e0b' },
  { name: 'Apr', value: 90, fill: '#ef4444' },
  { name: 'May', value: 40, fill: '#8b5cf6' },
];

export const domains = [
  { name: 'Engineering', icon: '🔧', active: true },
  { name: 'Finance', icon: '💰', active: false },
  { name: 'Ops', icon: '⚙️', active: false },
  { name: 'Customer Success', icon: '🎯', active: false },
];
export const heatmapData = [
  { title: 'Refactor', value: '8%', color: 'bg-purple-500' },
  { title: 'Features', value: '22%', color: 'bg-cyan-500' },
  { title: 'Bugs', value: '14%', color: 'bg-red-500' },
  { title: 'Testing', value: '10%', color: 'bg-emerald-500' },
  { title: 'Docs', value: '6%', color: 'bg-indigo-500' },
  { title: 'Chores', value: '4%', color: 'bg-amber-500' },
];

export const connectors: Connector[] = [
  { id: '1', name: 'Jira', icon: '/images/jira.png', active: true },
  { id: '2', name: 'Xero', icon: '/images/xero.png', active: false },
  { id: '3', name: 'Mail', icon: '/images/mail.png', active: false },
  { id: '4', name: 'Mekki', icon: '/images/message.png', active: false },
];

// Background Area Chart Data for GrowthVelocityScore
export const backgroundAreaData = [
  { name: 'Page A', value: 2400 },
  { name: 'Page B', value: 1398 },
  { name: 'Page C', value: 9800 },
  { name: 'Page D', value: 3908 },
  { name: 'Page E', value: 4800 },
  { name: 'Page F', value: 3800 },
  { name: 'Page G', value: 4300 },
];

// Pie Chart Data for GrowthVelocityScore
export const pieData = [
  { name: 'Speed', value: 35, fill: '#3b82f6' },
  { name: 'Quality', value: 65, fill: '#22c55e' },
];

// Performance Relays Chart Data for GrowthVelocityScore
export const performanceRelaysData = [
  { month: 'Jan', value: 45, baseline: 50 },
  { month: 'Feb', value: 52, baseline: 50 },
  { month: 'Mar', value: 58, baseline: 50 },
  { month: 'Apr', value: 65, baseline: 50 },
  { month: 'May', value: 70, baseline: 50 },
  { month: 'Jun', value: 78, baseline: 50 },
];

// Efficiency Metrics Data for GrowthVelocityScore
export const efficiencyMetricsData: EfficiencyMetric[] = [
  {
    id: '1',
    title: 'Avg. PR Review Time',
    value: '6.2 hrs',
    subtitle: '/ Pull Request',
    iconType: 'DollarSign',
    badges: ['GitHub', 'Jira'],
    trend: 'up',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: '2',
    title: 'Communication Overhead',
    value: '2.5',
    subtitle: 'Messages / Ticket',
    iconType: 'MessageSquare',
    badges: ['Slack', 'Jira'],
    trend: 'neutral',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: '3',
    title: 'Deploy Success Rate',
    value: '94%',
    subtitle: 'Last 30 days',
    iconType: 'Users',
    badges: ['GitHub', 'AWS'],
    trend: 'up',
    color: 'from-purple-500 to-pink-600',
  },
];

export const comparativeData = {
  title: 'Platform Alpha',
  subtitle:
    'Vs. UK Dev-tools SaaS: Ahead of 88% of similar-stage teams by deploy frequency',
  badge: 'ahead',
};

export const milestone = {
  title: 'Reduce CI Build Time by 30%',
  progress: 70,
  status: '70% Complete',
  estimate: 'Est. Sept 30',
  actual: 'Est. Oct 15',
};

// Cost Correlation Dashboard Data
export const costPerFeatureData = [
  { month: 'Jan', value: 95 },
  { month: 'Feb', value: 110 },
  { month: 'Mar', value: 105 },
  { month: 'Apr', value: 120 },
  { month: 'May', value: 115 },
  { month: 'Jun', value: 120 },
];

export const devDollarData = [
  { month: 'Jan', value: 2.1 },
  { month: 'Feb', value: 2.3 },
  { month: 'Mar', value: 2.4 },
  { month: 'Apr', value: 2.5 },
  { month: 'May', value: 2.4 },
  { month: 'Jun', value: 2.5 },
];

export const valueSpendData = [
  { month: 'Sep', value: 120, commits: 180 },
  { month: 'Oct', value: 140, commits: 160 },
  { month: 'Nov', value: 160, commits: 140 },
  { month: 'Dec', value: 180, commits: 120 },
  { month: 'Jan', value: 200, commits: 100 },
  { month: 'Feb', value: 220, commits: 80 },
];

export const costCorrelationHeatmapData = [
  [0.9, 0.7, 0.3, 0.2, 0.1],
  [0.8, 0.6, 0.5, 0.3, 0.2],
  [0.5, 0.4, 0.7, 0.5, 0.4],
  [0.3, 0.2, 0.4, 0.6, 0.7],
  [0.1, 0.1, 0.2, 0.4, 0.8],
];

export const costCorrelationHeatmapLabels = {
  x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  y: [
    'IDE Subscription',
    'Hot Subscription',
    'PR Tools',
    'Serverless Functions',
    'Storage',
  ],
};

// Request Center - Upvote Cards Data
export const upvoteCards = [
  {
    id: '1',
    name: 'HubSpot',
    icon: '/images/hubspot.png',
    votes: 142,
    status: 'HubSpot CRM',
    color: 'from-[#fff] to-[#fff]',
    type: 'progress' as const,
    progress: 'w-[75%]',
    progressColor: 'bg-orange-500',
  },
  {
    id: '2',
    name: 'Notion',
    icon: '/images/notion.png',
    votes: 142,
    status: 'Notion Workplace',
    color: 'from-[#fff] to-[#fff]',
    type: 'progress' as const,
    progress: 'w-[40%]',
    progressColor: 'bg-neutral-400',
  },
  {
    id: '3',
    name: 'AWS',
    icon: '/images/aws.png',
    votes: 142,
    status: 'Hi Violet',
    color: 'from-[#fff] to-[#fff]',
    type: 'progress' as const,
    progress: 'w-[75%]',
    progressColor: 'bg-blue-500',
  },
  {
    id: '4',
    name: 'DataDog',
    icon: '/images/datadog.png',
    votes: 142,
    status: 'In Development',
    color: 'from-[#fff] to-[#fff]',
    type: 'progress' as const,
    progress: 'w-[60%]',
    progressColor: 'bg-green-500',
  },
  {
    id: '5',
    name: 'HataDog',
    icon: null,
    votes: 98,
    status: 'Status',
    color: 'from-blue-400 to-blue-600',
    type: 'progress' as const,
    progress: 'w-[40%]',
    progressColor: 'bg-indigo-500',
  },
  {
    id: '6',
    name: 'DataDog',
    icon: '/images/datadog.png',
    votes: 67,
    status: 'New Request',
    color: 'from-[#fff] to-[#fff]',
    type: 'progress' as const,
    progress: 'w-[20%]',
    progressColor: 'bg-orange-600',
  },
];

// Request Center - Data Diagram Cards
export const dataDiagramCards = [
  {
    id: '1',
    title: 'New Connector',
    description: 'New Connector',
    icon: 'Cloud' as const,
    iconColor: 'text-blue-400',
    bgGradient: 'from-blue-500/5 to-transparent',
    shadowColor: 'hover:shadow-blue-500/20',
    badge: 'Input',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400',
    pulseDelay: '0s',
  },
  {
    id: '2',
    title: 'Webhook',
    description: 'Profectia Data Forge',
    icon: 'Network' as const,
    iconColor: 'text-purple-400',
    bgGradient: 'from-purple-500/5 to-transparent',
    shadowColor: 'hover:shadow-purple-500/20',
    badge: 'Processing',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-400',
    pulseDelay: '0.5s',
  },
  {
    id: '3',
    title: 'Public API',
    description: 'Private Results',
    icon: 'Settings' as const,
    iconColor: 'text-green-400',
    bgGradient: 'from-green-500/5 to-transparent',
    shadowColor: 'hover:shadow-green-500/20',
    badge: 'Output',
    badgeBg: 'bg-green-500/10',
    badgeBorder: 'border-green-500/30',
    badgeText: 'text-green-400',
    pulseDelay: '1s',
    hasLockIcon: true,
  },
];

export const apps = ['Intercom', 'Slack', 'Salesforce', 'Zendesk', 'Jira'];
export const availableTags = [
  'Intercom',
  'Bugni 3',
  'Finance',
  'Marketing',
  'Sales',
  'Support',
  'Engineering',
];

// Expanded permission models. The first five entries are explicit models
// intended for the recommended connectors (github, slack, jira, xero, stripe).
// Each entry includes a `slug` to allow explicit mapping from connector name.
export const permissionModels = [
  {
    id: 108,
    slug: 'gmail',
    permissions: [
      {
        label: 'Read emails',
        description: 'Read all messages and threads in your inbox and folders',
      },
      {
        label: 'Send emails',
        description: 'Compose and send emails on your behalf',
      },
      {
        label: 'Manage drafts',
        description: 'Create, edit, and delete email drafts',
      },
      {
        label: 'Access contacts',
        description:
          'Read contact names and email addresses from your Google Contacts',
      },
      {
        label: 'View labels & folders',
        description:
          'Read your email labels, categories, and folder organisation',
      },
      {
        label: 'Email metadata',
        description:
          'Access sender, recipient, subject, and timestamp information',
      },
    ],
    content:
      'Gmail Integration - Read and send access to your inbox, drafts, contacts, and email metadata for AI-powered insights.',
  },
  {
    id: 109,
    slug: 'linkedin',
    permissions: [
      {
        label: 'Read your profile',
        description:
          'Access your name, headline, photo, and profile information',
      },
      {
        label: 'Read your messages',
        description: 'View your LinkedIn inbox and message conversations',
      },
      {
        label: 'Send messages',
        description: 'Send messages to your connections on your behalf',
      },
      {
        label: 'Read your posts',
        description: 'Access your published posts, shares, and activity feed',
      },
      {
        label: 'Post on your behalf',
        description: 'Publish posts and share content to your LinkedIn profile',
      },
      {
        label: 'Read connections',
        description:
          'View your connection list and their basic public profiles',
      },
    ],
    content:
      'LinkedIn Integration - Profile, messaging, and post access for professional network insights and content alignment.',
  },
  {
    id: 106,
    slug: 'amazon web services (aws)',
    permissions: [
      {
        label: 'IAM read',
        description: 'Read IAM roles, policies, and user permissions',
      },
      {
        label: 'EC2 read',
        description: 'List and describe EC2 instances and their states',
      },
      {
        label: 'CloudWatch',
        description: 'Read metrics, logs, and alarms from CloudWatch',
      },
      {
        label: 'S3 read',
        description: 'List S3 buckets and read object metadata',
      },
      {
        label: 'Cost Explorer',
        description: 'Read usage and cost data for spend analysis',
      },
    ],
    content:
      'AWS Integration - Infrastructure monitoring and resource tracking across EC2, S3, and CloudWatch.',
  },
  {
    id: 107,
    slug: 'microsoft azure',
    permissions: [
      {
        label: 'Resource read',
        description: 'Read Azure resource groups and resource metadata',
      },
      {
        label: 'Monitor read',
        description: 'Access Azure Monitor metrics and diagnostic logs',
      },
      {
        label: 'DevOps read',
        description: 'Read Azure DevOps pipelines, repos, and work items',
      },
      {
        label: 'User read',
        description:
          'Read user and service principal profiles via Microsoft Graph',
      },
    ],
    content:
      'Azure Integration - Resource monitoring, DevOps pipelines, and identity tracking across Azure services.',
  },
  {
    id: 101,
    slug: 'github',
    permissions: [
      {
        label: 'Read repositories',
        description: 'Access repository metadata, issues, and pull requests',
      },
      {
        label: 'Read commits & branches',
        description: 'View commit history, branches, and code changes',
      },
      {
        label: 'Create issues & PRs',
        description: 'Create and manage issues and pull requests',
      },
      {
        label: 'Edit pull requests',
        description: 'Update PR titles, descriptions, labels, and reviewers',
      },
      {
        label: 'Review & approve PRs',
        description: 'Submit reviews, approvals, and change requests',
      },
      {
        label: 'Merge pull requests',
        description: 'Merge approved PRs into target branches',
      },
      {
        label: 'Manage comments',
        description: 'Create and edit issue and PR comments',
      },
      {
        label: 'Read workflows',
        description: 'View GitHub Actions workflow runs and logs',
      },
      {
        label: 'User & team data',
        description: 'Access user profiles and team membership information',
      },
    ],
    content:
      'GitHub Integration - Repository access with issue, PR, and workflow visibility.',
  },
  {
    id: 102,
    slug: 'slack',
    permissions: [
      {
        label: 'Read channels',
        description: 'Read channel list, names, and descriptions',
      },
      {
        label: 'Read messages',
        description: 'View messages and conversation history in channels',
      },
      {
        label: 'Post messages',
        description: 'Send messages to channels and direct messages',
      },
      {
        label: 'User profiles',
        description: 'Access user profile information and presence status',
      },
      {
        label: 'App mentions',
        description: 'Receive notifications when app is mentioned',
      },
    ],
    content:
      'Slack Integration - Channel messaging and user collaboration tracking.',
  },
  {
    id: 103,
    slug: 'jira',
    permissions: [
      {
        label: 'Read issues',
        description: 'View all issues, epics, and their details',
      },
      {
        label: 'Create & edit issues',
        description: 'Create new issues and edit existing ones',
      },
      {
        label: 'Manage issue status',
        description: 'Transition issues between workflow states',
      },
      {
        label: 'Read projects & boards',
        description: 'Access project configurations and board layouts',
      },
      {
        label: 'View user assignments',
        description: 'See user assignments and work allocation',
      },
      {
        label: 'Webhooks & automation',
        description: 'Set up webhooks for issue events and automations',
      },
    ],
    content:
      'Jira Integration - Full issue tracking and project management visibility.',
  },
  {
    id: 104,
    slug: 'xero',
    permissions: [
      {
        label: 'Read invoices',
        description: 'View all customer invoices and invoice details',
      },
      {
        label: 'Read bills',
        description: 'Access supplier bills and bill information',
      },
      {
        label: 'Read bank accounts',
        description: 'View bank account details and transaction history',
      },
      {
        label: 'Read contacts',
        description: 'Access customer and supplier contact information',
      },
      {
        label: 'Export reports',
        description: 'Generate and export financial reports and statements',
      },
    ],
    content:
      'Xero Integration - Comprehensive accounting and financial data access.',
  },
  {
    id: 105,
    slug: 'stripe',
    permissions: [
      {
        label: 'Read payments',
        description: 'View all payment transactions and charge details',
      },
      {
        label: 'Read customers',
        description: 'Access customer profiles and payment methods',
      },
      {
        label: 'Read subscriptions',
        description: 'View subscription details and billing cycles',
      },
      {
        label: 'Create refunds',
        description: 'Initiate and manage payment refunds',
      },
      {
        label: 'Access payouts',
        description: 'View payout history and settlement information',
      },
    ],
    content:
      'Stripe Integration - Complete payment and customer transaction visibility.',
  },
  {
    id: 110,
    slug: 'microsoft teams',
    permissions: [
      {
        label: 'Read teams & channels',
        description: 'View teams, channels, and their organization',
      },
      {
        label: 'Read messages',
        description: 'Access team and channel message conversations',
      },
      {
        label: 'Post messages',
        description: 'Send messages to teams and channels',
      },
      {
        label: 'Read user profiles',
        description: 'View team member profiles and presence status',
      },
    ],
    content:
      'Microsoft Teams Integration - Team messaging and collaboration tracking.',
  },
  {
    id: 111,
    slug: 'asana',
    permissions: [
      {
        label: 'Read projects & tasks',
        description: 'View all projects, tasks, and subtasks',
      },
      {
        label: 'Create & edit tasks',
        description: 'Create new tasks and modify task details',
      },
      {
        label: 'View portfolios',
        description: 'Access portfolio views and project planning',
      },
      {
        label: 'Read team data',
        description: 'View team memberships and resource allocation',
      },
      {
        label: 'Read custom fields',
        description: 'Access custom fields and their values',
      },
    ],
    content:
      'Asana Integration - Project and task management with team insights.',
  },
  {
    id: 112,
    slug: 'trello',
    permissions: [
      {
        label: 'Read boards',
        description: 'View all boards and board organization',
      },
      {
        label: 'Read lists & cards',
        description: 'Access lists, cards, and card details',
      },
      {
        label: 'Create cards',
        description: 'Create and manage cards on boards',
      },
      {
        label: 'Read members',
        description: 'View team members and their assignments',
      },
    ],
    content:
      'Trello Integration - Kanban board tracking and task visualization.',
  },
  {
    id: 113,
    slug: 'quickbooks online',
    permissions: [
      {
        label: 'Read invoices',
        description: 'View customer invoices and invoice details',
      },
      {
        label: 'Read expenses',
        description: 'Access bill and expense information',
      },
      {
        label: 'Read accounts',
        description: 'View chart of accounts and account balances',
      },
      {
        label: 'Read customers',
        description: 'Access customer information and contact details',
      },
      {
        label: 'Export reports',
        description: 'Generate and export financial reports',
      },
    ],
    content:
      'QuickBooks Online Integration - Accounting data and financial reporting access.',
  },
  {
    id: 114,
    slug: 'paypal',
    permissions: [
      {
        label: 'Read transactions',
        description: 'View all payments and transaction history',
      },
      {
        label: 'Read invoices',
        description: 'Access invoice details and history',
      },
      {
        label: 'Read refunds',
        description: 'View refund records and status',
      },
      {
        label: 'Create refunds',
        description: 'Initiate refunds for transactions',
      },
    ],
    content: 'PayPal Integration - Payment transaction and invoice visibility.',
  },
  {
    id: 115,
    slug: 'gitlab',
    permissions: [
      {
        label: 'Read repositories',
        description: 'Access repository metadata and contents',
      },
      {
        label: 'Read merge requests',
        description: 'View merge requests and code reviews',
      },
      {
        label: 'Read commits',
        description: 'View commit history and changes',
      },
      {
        label: 'Read CI/CD pipelines',
        description: 'Access pipeline runs and build logs',
      },
      {
        label: 'Read issue tracking',
        description: 'View issues and issue tracking data',
      },
    ],
    content: 'GitLab Integration - Repository and CI/CD pipeline visibility.',
  },
  {
    id: 116,
    slug: 'bitbucket',
    permissions: [
      {
        label: 'Read repositories',
        description: 'Access repository metadata and source code',
      },
      {
        label: 'Read pull requests',
        description: 'View pull requests and code reviews',
      },
      {
        label: 'Read commits',
        description: 'View commit history and branch information',
      },
      {
        label: 'Read pipelines',
        description: 'Access Bitbucket Pipelines run history',
      },
    ],
    content:
      'Bitbucket Integration - Repository management and code review tracking.',
  },
  {
    id: 117,
    slug: 'google cloud platform (gcp)',
    permissions: [
      {
        label: 'Read projects',
        description: 'View GCP projects and resource organization',
      },
      {
        label: 'Read compute',
        description: 'View Compute Engine instances and configurations',
      },
      {
        label: 'Read storage',
        description: 'Access Cloud Storage buckets and object metadata',
      },
      {
        label: 'Read BigQuery',
        description: 'View datasets and query information',
      },
      {
        label: 'Read billing',
        description: 'Access billing information and cost data',
      },
    ],
    content: 'GCP Integration - Cloud infrastructure and resource visibility.',
  },
  {
    id: 118,
    slug: 'dropbox',
    permissions: [
      {
        label: 'Read files & folders',
        description: 'View file and folder structure in account',
      },
      {
        label: 'Read file contents',
        description: 'Access file metadata and content information',
      },
      {
        label: 'View sharing info',
        description: 'See file sharing status and permissions',
      },
    ],
    content: 'Dropbox Integration - File storage and organization access.',
  },
  {
    id: 119,
    slug: 'google drive',
    permissions: [
      {
        label: 'Read files & folders',
        description: 'View file and folder organization',
      },
      {
        label: 'Read file contents',
        description: 'Access document metadata and contents',
      },
      {
        label: 'Read sharing settings',
        description: 'View file sharing and permission status',
      },
      {
        label: 'View comments',
        description: 'See file comments and revision history',
      },
    ],
    content:
      'Google Drive Integration - Document storage and collaboration tracking.',
  },
  {
    id: 1,
    permissions: [
      {
        label: 'Read access',
        description: 'Basic read permissions for data retrieval',
      },
      {
        label: 'User profiles',
        description: 'Access to user and team member profiles',
      },
      { label: 'Data sync', description: 'Synchronize data between platforms' },
    ],
    content:
      'Basic Integration Model - Essential permissions for core functionality and data reading capabilities.',
  },
  {
    id: 2,
    permissions: [
      {
        label: 'Read/Write access',
        description: 'Full read and write permissions for data management',
      },
      {
        label: 'Team collaboration',
        description: 'Access to team workspace and collaboration features',
      },
      {
        label: 'API integration',
        description: 'Enable API calls and integrations',
      },
      {
        label: 'Webhooks',
        description: 'Set up and manage event-based webhooks',
      },
    ],
    content:
      'Standard Integration Model - Comprehensive permissions for team collaboration and full data management.',
  },
  {
    id: 3,
    permissions: [
      {
        label: 'Full admin access',
        description: 'Complete administrative permissions',
      },
      {
        label: 'User management',
        description: 'Manage user roles, permissions, and access',
      },
      {
        label: 'Audit logs',
        description: 'Access to system audit logs and activity tracking',
      },
      {
        label: 'Custom workflows',
        description: 'Create and manage custom automation workflows',
      },
      {
        label: 'Advanced analytics',
        description: 'Access to advanced reporting and analytics dashboards',
      },
    ],
    content:
      'Enterprise Integration Model - Advanced permissions including user management, auditing, and custom workflows.',
  },
  {
    id: 4,
    permissions: [
      {
        label: 'Full platform access',
        description: 'Complete access to all platform features',
      },
      {
        label: 'Organization settings',
        description: 'Configure organization-wide settings and policies',
      },
      {
        label: 'User provisioning',
        description: 'Automated user creation and deprovisioning',
      },
      {
        label: 'Security policies',
        description: 'Manage security protocols and compliance settings',
      },
      {
        label: 'Billing & usage',
        description: 'Access billing information and usage analytics',
      },
      {
        label: 'Custom integrations',
        description: 'Build and deploy custom integration connectors',
      },
    ],
    content:
      'Premium Integration Model - Ultimate permissions for full platform control, security management, and custom integrations.',
  },
];
export const samples: Record<string, string[]> = {
  azure: [
    'profecia-ui',
    'api-service',
    'infra-arm',
    'staging-rg',
    'prod-rg',
    'monitor-alerts',
    'devops-pipelines',
  ],

  github: ['profecia-ui', 'ai-engine', 'data-pipeline', 'infra-scripts'],

  slack: ['#general', '#engineering'],

  notion: [
    'Product Wiki',
    'Roadmap',
    'Meeting Notes',
    'Research',
    'Sprint Docs',
  ],

  jira: ['PROF', 'AI', 'OPS'],

  aws: [
    'prod-account',
    'staging-account',
    'sandbox',
    'analytics',
    'backup',
    'ml-lab',
    'dev-env',
  ],

  xero: ['Invoices', 'Bills', 'Reports', 'Contacts'],

  stripe: ['Charges', 'Customers', 'Subscriptions', 'Disputes', 'Payouts'],

  quickbooksonline: ['Invoices', 'Expenses'],

  asana: ['Projects', 'Tasks', 'Goals', 'Timelines', 'Teams', 'Portfolio'],

  trello: ['Boards', 'Cards', 'Lists'],

  microsoftteams: ['Teams', 'Channels', 'Meetings', 'Files', 'Calendar'],

  discord: ['Servers', 'Channels'],

  gitlab: ['frontend-repo', 'backend-core', 'ci-cd', 'security-scans', 'docs'],

  bitbucket: [
    'Main Repo',
    'Dev Branch',
    'Release Branch',
    'Hotfix',
    'Docs',
    'Pipelines',
  ],

  jenkins: ['CI Pipeline', 'CD Deploy', 'Test Automation', 'Artifacts'],

  docker: ['profecia-app', 'profecia-db', 'redis-cache'],

  kubernetes: [
    'production-cluster',
    'staging-cluster',
    'api-pods',
    'worker-nodes',
    'monitoring',
  ],

  datadog: ['APM', 'Logs', 'Infra Monitoring', 'Alerts'],

  zoom: ['Team Meetings', 'Webinars', 'Recordings', 'Chat'],

  googlecloud: ['Compute Engine', 'BigQuery', 'Cloud Storage'],
};
