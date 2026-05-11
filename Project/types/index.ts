export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

export interface Suggestion {
  id: number;
  icon: any;
  text: string;
  color: string;
}

export interface Notification {
  id: number;
  text: string;
  time: string;
}

export interface ListItem {
  id: number;
  name: string;
  count: number;
}

// components/auth/types.ts
export interface AuthModalStepProps {
  step: number;
  setStep: (step: number) => void;
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  error: string;
  setError: (val: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  selectedCategory: "it" | "finance" | null;
  setSelectedCategory: (cat: "it" | "finance" | null) => void;
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  handleNext: () => void;
  handleBack: () => void;
  onClose: () => void;
  handleSocialLogin?: (provider: "google" | "facebook") => void;
  handleEmailAuth?: () => void;
  router: any; // or better type from next/navigation
  resetOnboarding?: () => void;
}

export interface Connector {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  trendData: (number | { [key: string]: any })[];
  color: string;
  badge?: string;
  percentage?: string;
  trend?: "up" | "down" | "neutral";
}

export interface DashboardChartsProps {
  runwayData?: Array<{ month: string; value: number }>;
  synthesisData?: Array<{ date: string; devVelocity: number; cost: number }>;
  metricCards?: MetricCard[];
  technicalDebtData?: Array<{ name: string; value: number; fill: string }>;
  backgroundAreaData?: Array<{ name: string; value: number }>;
  pieData?: Array<{ name: string; value: number; fill: string }>;
  performanceRelaysData?: Array<{
    month: string;
    value: number;
    baseline: number;
  }>;
  costPerFeatureData?: Array<{ month: string; value: number }>;
  devDollarData?: Array<{ month: string; value: number }>;
  valueSpendData?: Array<{ month: string; value: number; commits: number }>;
  costHeatmapData?: number[][];
  costHeatmapLabels?: { x: string[]; y: string[] };
  heatmapData?: Array<{ title: string; value: string; color: string }>;
}

interface ActionItem {
  id: number;
  title: string;
  description: string;
  delay: number;
  hasAlert?: boolean;
  hasRedBorder?: boolean;
}

export interface EfficiencyMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  iconType: "DollarSign" | "MessageSquare" | "Users";
  badges: string[];
  trend: "up" | "down" | "neutral";
  color: string;
}

export interface DashboardCradsProps {
  actionItems?: ActionItem[];
  efficiencyMetrics?: EfficiencyMetric[];
  upvoteCards?: UpvoteCard[];
}

export interface UpvoteCard {
  id: string;
  name: string;
  icon: string | null;
  votes: number;
  status: string;
  color: string;
  type: "progress";
  progress: string;
  progressColor: string;
}

export interface DataDiagramCard {
  id: string;
  title: string;
  description: string;
  icon: "Cloud" | "Network" | "Settings";
  iconColor: string;
  bgGradient: string;
  shadowColor: string;
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  pulseDelay: string;
  hasLockIcon?: boolean;
}

export interface AppNameDropdownConfig {
  selectedApp: string;
  setSelectedApp: (app: string) => void;
  apps: string[];
  apiIntegration: boolean;
  setApiIntegration: (value: boolean) => void;
  badgesDirect: boolean;
  setBadgesDirect: (value: boolean) => void;
}

export interface DashboardCradsProps {
  actionItems?: ActionItem[];
  efficiencyMetrics?: EfficiencyMetric[];
  upvoteCards?: UpvoteCard[];
  dataDiagramCards?: DataDiagramCard[];
  appNameDropdownConfig?: AppNameDropdownConfig;
}
