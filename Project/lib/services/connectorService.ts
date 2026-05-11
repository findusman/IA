// lib/services/connectorService.ts

export interface ConnectorDetails {
  emailContacts?: string[];
  lastRepliedEmail?: string;
  recentEmails?: string[];
  importantThreads?: string[];
  repositories?: string[];
  pullRequests?: string[];
  issues?: string[];
  projects?: string[];
  channels?: string[];
  workspaces?: string[];
  boards?: string[];
  tasks?: string[];
  unreadCount?: number;
  teamMembers?: string[];
  pinnedItems?: string[];
  recentActivity?: string[];
  linkedInMessages?: string[];
  linkedInPosts?: string[];
}

const connectorMockData: Record<string, ConnectorDetails> = {
  Gmail: {
    emailContacts: [
      'john.doe@company.com',
      'jane.smith@client.co',
      'team@organization.com',
      'support@vendor.io',
      'hr@company.com',
      'product@startup.io',
      'dev-team@agency.com',
      'cto@partner.com',
      'marketing@agency.io',
      'finance@company.com',
      'legal@firm.com',
      'contract@vendor.net',
    ],
    unreadCount: 12,
  },
  GitHub: {
    repositories: [
      'my-awesome-project',
      'api-server',
      'frontend-app',
      'ml-models',
      'data-pipeline',
      'mobile-app',
      'cli-tool',
      'design-system',
      'documentation',
      'testing-framework',
      'deployment-config',
      'monitoring-dashboard',
    ],
  },
  Slack: {
    channels: [
      '#general',
      '#engineering',
      '#sales',
      '#random',
      '#announcements',
      '#marketing',
      '#product',
      '#finance',
      '#hr',
      '#operations',
      '#security',
      '#support',
      '#leadership',
      '#projects',
    ],
  },
  Jira: {
    projects: [
      'PROJ',
      'INFRA',
      'DEVOPS',
      'MOBILE',
      'API',
      'SECURITY',
      'QA',
      'DESIGN',
      'BACKEND',
      'FRONTEND',
    ],
    tasks: [
      'PROJ-123: Implement new dashboard',
      'INFRA-456: Database migration',
      'DEVOPS-789: CI/CD pipeline upgrade',
      'MOBILE-234: iOS app refactor',
      'API-567: REST API versioning',
      'SECURITY-890: Penetration testing',
      'QA-345: Automated test framework',
      'DESIGN-678: UI/UX redesign',
      'BACKEND-901: Performance optimization',
      'FRONTEND-212: React component library',
    ],
  },
  LinkedIn: {
    linkedInMessages: [
      'Message from John Doe about project collaboration',
      'Direct message from Jane Smith - meeting follow-up',
      'Connection request from Sarah Johnson',
      'Message from Engineering Lead - code review feedback',
      'Chat with Product Manager about roadmap',
      'Discussion in tech community group',
      'Message from HR about career development',
      'Networking conversation with industry peer',
    ],
    linkedInPosts: [
      'Just published: "10 Best Practices for Cloud Architecture"',
      'Congratulations post from team member\'s promotion',
      'Company announcement: Q1 results exceeded targets',
      'Industry insight: Latest trends in AI/ML',
      'Job posting: Senior Developer position open',
      'Thought leadership: The future of remote work',
      'Celebration: Team reached 5-year milestone',
      'Article share: Innovation in tech industry',
    ],
  },
  'Microsoft Teams': {
    channels: [
      '#general',
      '#engineering',
      '#management',
      '#announcements',
      '#projects',
      '#compliance',
      '#innovation',
      '#partnership',
      '#training',
      '#social',
      '#feedback',
      '#archive',
    ],
  },
  'Amazon Web Services (AWS)': {
    repositories: [
      'EC2 Instances',
      'S3 Buckets',
      'Lambda Functions',
      'RDS Databases',
      'DynamoDB Tables',
      'CloudFront Distributions',
      'VPC Networks',
      'IAM Roles',
      'CloudWatch Logs',
      'SNS Topics',
      'SQS Queues',
      'ElastiCache Clusters',
    ],
  },
  'Microsoft Azure': {
    repositories: [
      'Virtual Machines',
      'App Services',
      'SQL Databases',
      'Cosmos DB',
      'Storage Accounts',
      'Container Instances',
      'Service Bus',
      'Event Hubs',
      'Key Vault',
      'Application Insights',
      'Logic Apps',
      'Azure Functions',
    ],
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchConnectorDetails(
  connectorName: string,
): Promise<ConnectorDetails> {
  // Simulate network delay
  await delay(Math.random() * 1500 + 1000);

  // Return mock data or empty object
  return connectorMockData[connectorName] || {};
}
