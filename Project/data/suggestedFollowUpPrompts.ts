export type FollowUpPrompt = {
  label: string;
  prompt: string;
};

export const priorityConnectorPrompts: Record<string, FollowUpPrompt[]> = {
  github: [
    {
      label: "Code Quality Analysis",
      prompt:
        "Analyze the recent pull requests and commits from our GitHub repository. Identify patterns in code quality, common issues, and provide recommendations to improve our development workflow. Consider velocity metrics and deployment frequency.",
    },
    {
      label: "Security & Vulnerabilities",
      prompt:
        "Review recent security findings and dependency vulnerabilities from our GitHub repositories. Provide a prioritized list of critical updates needed, timeline estimates for resolution, and recommendations for automated security scanning.",
    },
    {
      label: "Team Productivity Insights",
      prompt:
        "Based on GitHub contribution history, merge times, and review cycles, generate insights on team productivity. Identify bottlenecks in our development process and suggest optimization strategies to improve code delivery speed.",
    },
  ],
  slack: [
    {
      label: "Communication Patterns",
      prompt:
        "Analyze Slack communication patterns across teams. Identify key discussion topics, team collaboration efficiency, and provide insights on communication flow. Suggest improvements for cross-functional collaboration.",
    },
    {
      label: "Incident Response Review",
      prompt:
        "Review incident-related discussions in Slack. Summarize response times, resolution effectiveness, and team coordination during critical issues. Provide recommendations to streamline incident management processes.",
    },
    {
      label: "Team Engagement Metrics",
      prompt:
        "Generate engagement metrics from Slack activity. Measure team responsiveness, active participation, and collaboration trends. Identify areas for improved team communication and engagement.",
    },
  ],
  jira: [
    {
      label: "Sprint Performance Analysis",
      prompt:
        "Analyze our current and recent sprints using Jira data. Calculate velocity trends, burndown patterns, and identify bottlenecks. Provide recommendations for sprint planning and capacity management improvements.",
    },
    {
      label: "Issue Backlog Optimization",
      prompt:
        "Review our Jira backlog to identify stale, duplicate, or low-priority issues. Provide recommendations for backlog refinement, prioritization strategy, and technical debt management.",
    },
    {
      label: "Team Workload Distribution",
      prompt:
        "Analyze issue assignments and workload distribution across team members in Jira. Identify unbalanced workloads, skill gaps, and provide recommendations for better resource allocation and team capacity planning.",
    },
  ],
  notion: [
    {
      label: "Knowledge Base Audit",
      prompt:
        "Conduct an audit of our Notion knowledge base. Identify outdated documentation, gaps in coverage, and redundant pages. Provide a consolidation strategy to improve information accessibility and maintainability.",
    },
    {
      label: "Documentation Structure",
      prompt:
        "Review the organization and hierarchy of our Notion workspace. Suggest improvements for information architecture, navigation structure, and database relationships to enhance usability and discoverability.",
    },
    {
      label: "Collaboration Effectiveness",
      prompt:
        "Analyze collaboration patterns in Notion across teams. Identify frequently accessed documents, unused sections, and improvement opportunities. Provide recommendations for better knowledge sharing and team alignment.",
    },
  ],
  vercel: [
    {
      label: "Deployment Pipeline Analysis",
      prompt:
        "Analyse our Vercel deployment history. Identify failed deployments, average build times per branch, and peak deployment windows. Provide recommendations to reduce build queue time and improve deployment reliability.",
    },
    {
      label: "Preview Environment Audit",
      prompt:
        "Review our Vercel preview deployment configuration. Identify branches that are triggering unnecessary builds and suggest trigger scoping rules to cut redundant preview deployments.",
    },
    {
      label: "Edge & Cache Optimisation",
      prompt:
        "Evaluate which routes are eligible for Vercel Edge Network caching and ISR. Identify pages with high TTFB and recommend caching strategies to improve performance without sacrificing data freshness.",
    },
  ],
  aws: [
    {
      label: "Infrastructure Health Check",
      prompt:
        "Review our AWS infrastructure for idle resources, misconfigured security groups, and services with no recent activity. Provide a prioritised list of cleanup actions to reduce operational overhead.",
    },
    {
      label: "CI/CD & Deployment Pipelines",
      prompt:
        "Analyse our AWS CodePipeline / ECS deployment workflows. Identify bottlenecks, long-running stages, and failed rollbacks. Recommend improvements to increase deployment frequency and reduce MTTR.",
    },
    {
      label: "Staging Environment Consolidation",
      prompt:
        "Audit our AWS staging environments. Identify redundant environments running in parallel for the same service and propose a branch-based namespace strategy to simplify infrastructure management.",
    },
  ],
};

export const universalFollowUpPrompts: FollowUpPrompt[] = [
  {
    label: "Data Integration Analysis",
    prompt:
      "Analyze the data available from this connector. Provide insights on data quality, completeness, update frequency, and integration effectiveness. Suggest optimization opportunities and potential use cases.",
  },
  {
    label: "Operational Efficiency",
    prompt:
      "Review operational metrics and efficiency indicators from this connector. Identify process bottlenecks, manual tasks that could be automated, and provide recommendations for streamlining operations.",
  },
  {
    label: "Strategic Recommendations",
    prompt:
      "Based on data from this connector, provide strategic recommendations aligned with business objectives. Identify opportunities for improvement, risk factors, and suggest prioritized action items.",
  },
  {
    label: "Performance & Bottleneck Analysis",
    prompt:
      "Evaluate system performance metrics and identify any bottlenecks. Analyze response times, throughput, and resource utilization. Provide recommendations to optimize performance and improve system reliability.",
  },
  {
    label: "Risk & Compliance Assessment",
    prompt:
      "Conduct a risk and compliance assessment based on data from this connector. Identify security vulnerabilities, compliance gaps, and regulatory risks. Provide recommendations to mitigate identified risks.",
  },
  {
    label: "Code Quality & Tech Debt Analysis",
    prompt:
      "Review code quality indicators from this connector. Identify areas of high technical debt, frequently changed files, and modules with low test coverage. Provide a prioritised refactoring plan.",
  },
  {
    label: "Integration Health Check",
    prompt:
      "Perform a comprehensive health check of this connector's integration. Review connection status, data sync frequency, error rates, and API health. Provide recommendations for maintaining or improving integration stability.",
  },
  {
    label: "Predictive Trends & Forecasting",
    prompt:
      "Analyze historical trends and data patterns from this connector. Generate forecasts for key metrics and identify emerging trends. Provide insights on future patterns and recommended proactive measures.",
  },
  {
    label: "User Activity & Adoption Metrics",
    prompt:
      "Review user activity patterns and adoption rates within this connector. Identify usage trends, frequently used features, and underutilized capabilities. Provide recommendations to increase adoption and engagement.",
  },
];

export const getFollowUpsForConnector = (
  connectorName: string,
): FollowUpPrompt[] => {
  const lowerName = connectorName.toLowerCase();

  // Return priority connector prompts (3 prompts each)
  if (priorityConnectorPrompts[lowerName]) {
    return priorityConnectorPrompts[lowerName];
  }

  // For other connectors, select 3 random universal prompts consistently
  // Use connector name as seed for consistent random selection
  const seed = connectorName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const shuffled = [...universalFollowUpPrompts].sort(
    () => (seed % 2 === 0 ? -1 : 1) * (Math.random() - 0.5),
  );

  return shuffled.slice(0, 3);
};

export const suggestedQuestionsBank = [
  "What's the correlation between deployment frequency and system stability?",
  "Which PRs have been open the longest without a reviewer assigned?",
  "Analyse team sprint velocity trends across all active projects",
  "Which APIs have the highest error rates this week?",
  "Compare test coverage across our main repositories",
  "What are the top performance bottlenecks in our services?",
  "Generate a security posture summary for our connected tools",
  "Show me resource utilisation trends for our staging environments",
  "Identify high-churn code areas that need refactoring",
  "What tickets should we prioritise in the next sprint?",
  "Which CI/CD pipelines have the most frequent failures?",
  "Show me the deployment pipeline health across all services",
];

export const assistantResponsesBank = [
  "Based on the data analysis across your connected systems, I can see clear patterns in your operational metrics. The correlation between your deployment frequency and system stability shows a moderate positive trend. Key insights: Your team's recent optimisation efforts have yielded a 23% improvement in deployment success rate.",
  "Cross-referencing GitHub and Jira, here's what stands out: sprint velocity has increased by 18% over the last 3 sprints, but PR merge time has grown by 2 days. The bottleneck is in the code review stage — 7 PRs are awaiting a second reviewer for 48+ hours.",
  "The analysis reveals strong momentum in your team's performance. Sprint velocity is up 18% over the last 3 sprints, with the platform team leading improvements. However, QA cycle times need attention — they're trending upward by 22% this quarter.",
  "Cross-referencing your infrastructure logs and incident data, I've identified several optimisation opportunities. Your database queries could be optimised to reduce average response time by approximately 40%. I recommend prioritising indexes on your most-used tables.",
  "From your security and compliance data, here's the assessment: Your overall security posture is strong with only 2 minor vulnerabilities detected. However, 12% of API tokens appear to have excessive scopes. Recommendation: Audit and rotate credentials with least-privilege scoping this sprint.",
  "Analysing GitHub activity and deployment logs, I can see that your `main` branch has 4 commits per day on average. The last 3 deployments succeeded, but build times have crept up 35% over 2 weeks — the test parallelisation config likely needs revisiting.",
  "Your API performance is excellent overall, with 99.98% uptime in the last 30 days. The `/analytics` endpoint averages 120ms response time and should be your focus for optimisation. Current error rate is 0.02%, which is well within acceptable ranges.",
  "Based on infrastructure trends, your resource allocation is optimised at 78% efficiency. However, during peak hours you're approaching 92% capacity. I recommend configuring auto-scaling on your backend services to maintain performance during deployment windows.",
  "Your CI/CD pipeline shows a median deployment time of 4.2 minutes — excellent for your scale. The build stage represents 65% of total time. Parallelising your test suites could reduce this to 2.8 minutes without adding infrastructure overhead.",
  "Looking at your Jira backlog, there are 34 tickets untouched for 60+ days and 12 epics with no active work. I recommend a focused backlog grooming session to archive stale items and reprioritise the tech debt epic currently sitting at the bottom of the board.",
  "GitHub contribution analysis shows 3 engineers are responsible for 70% of reviews. This is a bottleneck and a bus-factor risk. Consider implementing a CODEOWNERS rotation and requiring at least 2 reviewers from different squads for critical paths.",
  "Your system architecture shows good separation of concerns with well-defined microservices. However, 3 services have tight coupling that would benefit from refactoring. This would improve resilience and reduce incident response time by approximately 25%.",
];
