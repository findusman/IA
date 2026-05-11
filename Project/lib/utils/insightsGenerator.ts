import { ConnectedConnector } from "@/lib/store/connectorStore";

export type Insight = {
  id: string;
  title: string;
  description: string;
  impactScore: number; // percent
  savings: string;
  confidence: number; // percent
  connectorName?: string; // Name of the connector for icon display
  executionLogs: string[]; // Step-by-step log lines shown during execution modal
};

// Priority connectors with specific insights
const priorityInsights: Record<string, Insight[]> = {
  github: [
    {
      id: "github-1",
      title: "Optimise CI/CD Pipeline Performance",
      description:
        "Detected redundant GitHub Actions workflows running in parallel. Consolidate overlapping jobs to cut build execution time and stay within API quota.",
      impactScore: 88,
      savings: "~6 hrs/sprint",
      confidence: 94,
      executionLogs: [
        "🔍 Connecting to GitHub API…",
        "📋 Fetching active workflow runs for all repositories…",
        "🔎 Analysing 14 workflow files for redundant job definitions…",
        "[ERR] Rate limit exceeded — 0 requests remaining, reset in 52s.",
        "[RETRY] Switching to secondary OAuth token and retrying…",
        "📋 Re-fetching workflow data via fallback credentials…",
        "⚙️  Identified 3 overlapping jobs across profecia-ui and api-service…",
        "[Q] 2 of the affected workflows run on the production branch. Apply changes there too?",
        "✏️  Generating consolidated workflow YAML with parallel job matrix…",
        "🚀 Pushing optimised workflow to .github/workflows/ci.yml…",
        "✅ Pipeline consolidated — estimated build time reduced by 38%.",
      ],
    },
    {
      id: "github-2",
      title: "Reduce PR Review Cycle Time",
      description:
        "Found 12 PRs open for 72+ hours with no reviewer assigned. Implement auto-assignment rules to unblock merges and improve deployment frequency.",
      impactScore: 72,
      savings: "~4 hrs/sprint",
      confidence: 89,
      executionLogs: [
        "🔍 Connecting to GitHub API…",
        "📋 Listing open pull requests across all repos…",
        "🔎 Found 12 PRs with no reviewer and no activity in 72+ hours…",
        "👥 Fetching team membership and code ownership from CODEOWNERS…",
        "⚙️  Assigning reviewers based on file ownership rules…",
        "🔔 Posting Slack notifications to assigned reviewers…",
        "✅ Auto-assignment rules applied — 12 PRs now have reviewers.",
      ],
    },
    {
      id: "github-3",
      title: "Enforce Branch Protection Rules",
      description:
        "Main branch has no required status checks enabled. Enabling branch protection will prevent direct pushes and enforce PR-based reviews.",
      impactScore: 91,
      savings: "~5 hrs/sprint",
      confidence: 97,
      executionLogs: [
        "🔍 Connecting to GitHub API…",
        "📋 Reading branch protection settings for main…",
        "⚠️  No required status checks or review approvals found…",
        "⚙️  Enabling require-PR-before-merge rule…",
        "⚙️  Adding required status checks: lint, test, build…",
        "🔒 Restricting direct push access to admins only…",
        "✅ Branch protection rules enforced on main.",
      ],
    },
    {
      id: "github-4",
      title: "Archive Stale Repositories",
      description:
        "Detected 6 repos with zero commits in the last 90 days. Archiving them reduces maintenance surface and noise in search.",
      impactScore: 65,
      savings: "~2 hrs/sprint",
      confidence: 88,
      executionLogs: [
        "🔍 Connecting to GitHub API…",
        "📋 Scanning repositories for last commit date…",
        "🔎 Found 6 repositories with no activity in 90+ days…",
        "📝 Generating archive confirmation report…",
        "⚙️  Setting repository visibility to archived…",
        "✅ 6 stale repositories archived successfully.",
      ],
    },
    {
      id: "github-5",
      title: "Rotate Expired Deploy Tokens",
      description:
        "2 deploy tokens are older than 180 days. Rotating them reduces security risk and ensures compliance with key-rotation policy.",
      impactScore: 85,
      savings: "~1 hr/sprint",
      confidence: 99,
      executionLogs: [
        "🔍 Connecting to GitHub API…",
        "🔑 Auditing deploy keys and personal access tokens…",
        "⚠️  Found 2 tokens with creation date >180 days ago…",
        "⚙️  Generating new deploy keys via GitHub Apps…",
        "🔄 Revoking old tokens and updating secrets in repository settings…",
        "✅ Deploy tokens rotated — old credentials invalidated.",
      ],
    },
  ],
  slack: [
    {
      id: "slack-1",
      title: "Streamline Incident Alert Routing",
      description:
        "Detected 3 overlapping alert channels sending duplicate notifications. Consolidate into a single #incidents channel to reduce alert fatigue.",
      impactScore: 81,
      savings: "~3 hrs/sprint",
      confidence: 92,
      executionLogs: [
        "🔍 Connecting to Slack API…",
        "📋 Listing workspace channels…",
        "🔎 Identified #alerts, #ops-alerts, and #infra-incidents sending duplicate payloads…",
        "[WARN] #ops-alerts is owned by an external integration — cannot archive directly.",
        "[Q] Redirect #ops-alerts webhooks to #incidents without archiving the channel? This is reversible.",
        "⚙️  Merging alert routing rules into #incidents channel…",
        "🔔 Updating PagerDuty webhook endpoints…",
        "[ERR] PagerDuty returned 401 — stored API key appears to be revoked.",
        "[RETRY] Loading PagerDuty credentials from Secrets Manager…",
        "🔔 Retrying PagerDuty webhook update with refreshed credentials…",
        "🗄️  Archiving remaining redundant channels…",
        "✅ Incident alert routing consolidated — alert fatigue reduced.",
      ],
    },
    {
      id: "slack-2",
      title: "Automate Standup Summaries",
      description:
        "Daily standups in Slack show repetitive manual status updates. Integrate a bot to auto-post Jira sprint summaries each morning.",
      impactScore: 68,
      savings: "~2 hrs/sprint",
      confidence: 85,
      executionLogs: [
        "🔍 Connecting to Slack API…",
        "📋 Reading #standup channel history for the past 2 sprints…",
        "🔎 Detected 94% of messages follow the same status template…",
        "⚙️  Configuring Profectia bot with Jira sprint summary template…",
        "🕗 Scheduling daily 09:00 post to #standup…",
        "✅ Standup bot activated — first summary posts tomorrow at 09:00.",
      ],
    },
    {
      id: "slack-3",
      title: "Clean Up Unused Public Channels",
      description:
        "Found 18 public channels with no messages in 30+ days. Archiving them keeps the workspace organised and reduces cognitive load.",
      impactScore: 60,
      savings: "~1 hr/sprint",
      confidence: 90,
      executionLogs: [
        "🔍 Connecting to Slack API…",
        "📋 Scanning all public channels for last message date…",
        "🔎 Found 18 channels with no activity in 30+ days…",
        "📝 Generating archive list for team review…",
        "⚙️  Archiving 18 inactive channels…",
        "✅ Workspace cleaned — 18 channels archived.",
      ],
    },
    {
      id: "slack-4",
      title: "Enable Do-Not-Disturb Schedules",
      description:
        "Team members are receiving notifications outside working hours. Enforcing DND schedules reduces burnout and improves focus time.",
      impactScore: 74,
      savings: "~2 hrs/sprint",
      confidence: 87,
      executionLogs: [
        "🔍 Connecting to Slack API…",
        "📋 Reading user notification settings…",
        "🔎 Found 11 users with no DND schedule configured…",
        "⚙️  Applying default DND schedule (18:00–09:00 local time)…",
        "✅ DND schedules applied to 11 team members.",
      ],
    },
    {
      id: "slack-5",
      title: "Sync Slack Status with Jira Sprints",
      description:
        "Team statuses in Slack do not reflect current Jira sprint assignments. Auto-syncing them improves visibility across the team.",
      impactScore: 66,
      savings: "~1 hr/sprint",
      confidence: 82,
      executionLogs: [
        "🔍 Connecting to Slack and Jira APIs…",
        "📋 Fetching current sprint assignments from Jira…",
        "🔎 Comparing sprint data against current Slack statuses…",
        "⚙️  Updating 9 user statuses to reflect active sprint tickets…",
        "✅ Slack statuses synced with Jira sprint board.",
      ],
    },
  ],
  jira: [
    {
      id: "jira-1",
      title: "Reduce Sprint Carryover Rate",
      description:
        "Current sprint carryover rate is 28%. Identify oversized tickets and split stories above 8 story points to improve sprint predictability.",
      impactScore: 84,
      savings: "~5 hrs/sprint",
      confidence: 91,
      executionLogs: [
        "🔍 Connecting to Jira API…",
        "📋 Fetching all tickets from the current sprint…",
        "🔎 Found 9 stories with estimate >8 story points…",
        "✂️  Generating sub-task split recommendations for each oversized story…",
        "📝 Creating draft sub-tasks and linking to parent stories…",
        "🔔 Notifying assignees of new sub-task breakdown…",
        "✅ Sprint plan updated — carryover risk reduced by an estimated 40%.",
      ],
    },
    {
      id: "jira-2",
      title: "Clear Stale Backlog Tickets",
      description:
        "Found 47 tickets untouched for 60+ days. Archive or close stale issues to keep the backlog actionable and reduce grooming time.",
      impactScore: 76,
      savings: "~3 hrs/sprint",
      confidence: 88,
      executionLogs: [
        "🔍 Connecting to Jira API…",
        "📋 Scanning backlog for tickets with no recent activity…",
        "🔎 Identified 47 issues unchanged in 60+ days…",
        "[WARN] 8 of those tickets still have open sub-tasks — closing the parent will leave orphans.",
        "[Q] Auto-close orphaned sub-tasks of stale parents as well? (Recommended)",
        "📝 Generating stale issue report for product owner review…",
        "⚙️  Transitioning 47 issues to Closed with resolution: Won't Do…",
        "[ERR] Batch transition failed for 5 issues — a workflow rule requires a comment before closing.",
        "[RETRY] Adding auto-generated resolution comment and retrying those 5 issues…",
        "⚙️  5 remaining issues closed with resolution note attached…",
        "✅ Backlog pruned — 47 stale tickets closed.",
      ],
    },
    {
      id: "jira-3",
      title: "Standardise Issue Templates",
      description:
        "Bug reports lack reproduction steps in 63% of cases. Enforcing an issue template will cut triage time and reduce back-and-forth.",
      impactScore: 79,
      savings: "~3 hrs/sprint",
      confidence: 90,
      executionLogs: [
        "🔍 Connecting to Jira API…",
        "📋 Sampling last 100 bug reports for field completeness…",
        "🔎 63% missing reproduction steps or environment info…",
        "⚙️  Creating issue template with required fields: Steps, Expected, Actual, Environment…",
        "📝 Applying template to Bug and Incident issue types…",
        "✅ Issue templates enforced across all projects.",
      ],
    },
    {
      id: "jira-4",
      title: "Auto-link PRs to Jira Tickets",
      description:
        "58% of recent PRs have no linked Jira ticket. Enabling auto-linking improves traceability and release notes generation.",
      impactScore: 82,
      savings: "~2 hrs/sprint",
      confidence: 93,
      executionLogs: [
        "🔍 Connecting to Jira and GitHub APIs…",
        "📋 Scanning recent PRs for Jira issue key in branch name or PR title…",
        "🔎 Found 58% of PRs with no linked issue…",
        "⚙️  Enabling Jira–GitHub Smart Commit integration…",
        "🔔 Adding PR template reminder to include issue key…",
        "✅ Auto-linking active — future PRs will be traced to Jira automatically.",
      ],
    },
    {
      id: "jira-5",
      title: "Set Up Velocity Trend Alerts",
      description:
        "No sprint velocity alerts are configured. Setting velocity thresholds will surface slowdowns before they impact delivery dates.",
      impactScore: 70,
      savings: "~2 hrs/sprint",
      confidence: 86,
      executionLogs: [
        "🔍 Connecting to Jira API…",
        "📋 Calculating velocity for the last 6 sprints…",
        "📊 Average velocity: 42 points · Threshold set at 32 points (−25%)…",
        "⚙️  Creating Jira automation rule for velocity drop alert…",
        "🔔 Alert will post to #engineering-alerts on Slack when triggered…",
        "✅ Velocity trend alert configured successfully.",
      ],
    },
  ],
  notion: [
    {
      id: "notion-1",
      title: "Consolidate Duplicate Tech Docs",
      description:
        "Detected multiple runbooks covering the same services. Merge into a single source of truth to reduce onboarding time and knowledge drift.",
      impactScore: 79,
      savings: "~4 hrs/sprint",
      confidence: 87,
      executionLogs: [
        "🔍 Connecting to Notion API…",
        "📋 Scanning Engineering workspace for runbook pages…",
        "🔎 Found 4 runbooks covering the same auth-service setup…",
        "⚙️  Merging content into master runbook with version history preserved…",
        "🗄️  Archiving 3 duplicate pages and adding redirect notices…",
        "✅ Docs consolidated — single source of truth established.",
      ],
    },
    {
      id: "notion-2",
      title: "Add ADR Templates to Codebase Docs",
      description:
        "Architecture Decision Records are missing for 8 recent design changes. Add ADR templates to capture decisions and speed up future code reviews.",
      impactScore: 71,
      savings: "~2 hrs/sprint",
      confidence: 83,
      executionLogs: [
        "🔍 Connecting to Notion API…",
        "📋 Reading Engineering > Architecture section…",
        "🔎 Found 8 design decisions with no ADR page…",
        "⚙️  Creating ADR template with fields: Context, Decision, Consequences…",
        "📝 Generating draft ADR pages for each unrecorded decision…",
        "✅ 8 ADR drafts created — ready for team review.",
      ],
    },
    {
      id: "notion-3",
      title: "Sync Sprint Goals to Team Wiki",
      description:
        'Current sprint goals exist only in Jira. Syncing them to Notion keeps the whole team aligned and reduces "where do I find X?" questions.',
      impactScore: 68,
      savings: "~1 hr/sprint",
      confidence: 84,
      executionLogs: [
        "🔍 Connecting to Notion and Jira APIs…",
        "📋 Fetching active sprint goals from Jira…",
        "⚙️  Updating Sprint Goals section in Notion Team Wiki…",
        "✅ Sprint goals synced to Notion — team wiki up to date.",
      ],
    },
    {
      id: "notion-4",
      title: "Tag and Categorise Untagged Pages",
      description:
        "62 pages have no tags or category assigned. Tagging them enables better search and reduces time spent finding documentation.",
      impactScore: 64,
      savings: "~2 hrs/sprint",
      confidence: 80,
      executionLogs: [
        "🔍 Connecting to Notion API…",
        "📋 Scanning all workspace pages for missing tags…",
        "🔎 Found 62 pages with no category or tag…",
        "⚙️  Applying auto-categorisation based on page title and content…",
        "📝 Tagging pages across Engineering, Product, and Ops categories…",
        "✅ 62 pages tagged — search coverage improved.",
      ],
    },
    {
      id: "notion-5",
      title: "Archive Outdated Meeting Notes",
      description:
        "Meeting notes older than 6 months are cluttering the workspace. Archiving them keeps the knowledge base focused and searchable.",
      impactScore: 58,
      savings: "~1 hr/sprint",
      confidence: 88,
      executionLogs: [
        "🔍 Connecting to Notion API…",
        "📋 Listing pages in Meeting Notes database…",
        "🔎 Found 34 notes older than 6 months…",
        "⚙️  Moving to Archive database with original creation date preserved…",
        "✅ 34 meeting notes archived.",
      ],
    },
  ],
  vercel: [
    {
      id: "vercel-1",
      title: "Optimise Preview Deployment Cadence",
      description:
        "Preview deployments are triggering on every commit including docs changes. Scope deployment triggers to src/ changes only to cut build queue time.",
      impactScore: 86,
      savings: "~5 hrs/sprint",
      confidence: 93,
      executionLogs: [
        "🔍 Connecting to Vercel API…",
        "📋 Reading deployment trigger configuration for all projects…",
        "🔎 Found 4 projects triggering on all file changes including /docs…",
        "⚙️  Updating vercel.json to scope triggers to src/ and public/ paths only…",
        "🚀 Pushing updated configuration to each project…",
        "✅ Deployment scope updated — docs-only commits will no longer trigger builds.",
      ],
    },
    {
      id: "vercel-2",
      title: "Enable Edge Caching for Static Routes",
      description:
        "Static pages are not using Vercel Edge Cache. Enable ISR on 6 high-traffic routes to reduce TTFB from ~800ms to under 100ms.",
      impactScore: 80,
      savings: "~3 hrs/sprint",
      confidence: 90,
      executionLogs: [
        "🔍 Connecting to Vercel API…",
        "📋 Analysing route performance data for the last 7 days…",
        "🔎 Found 6 high-traffic static routes with no ISR configuration…",
        "⚙️  Adding revalidate: 3600 to identified Next.js page exports…",
        "🚀 Deploying updated configuration…",
        "✅ ISR enabled — TTFB on static routes reduced to <100ms.",
      ],
    },
    {
      id: "vercel-3",
      title: "Clean Up Orphaned Preview Deployments",
      description:
        "23 preview deployments reference deleted branches. Removing them reduces project noise and frees up deployment slots.",
      impactScore: 63,
      savings: "~1 hr/sprint",
      confidence: 91,
      executionLogs: [
        "🔍 Connecting to Vercel API…",
        "📋 Fetching all preview deployments…",
        "🔎 Found 23 deployments linked to branches that no longer exist…",
        "⚙️  Deleting orphaned deployments…",
        "✅ 23 orphaned preview deployments removed.",
      ],
    },
    {
      id: "vercel-4",
      title: "Enforce Environment Variable Hygiene",
      description:
        "11 environment variables are set in Production but not in Preview. Syncing them prevents preview-specific runtime errors.",
      impactScore: 77,
      savings: "~2 hrs/sprint",
      confidence: 89,
      executionLogs: [
        "🔍 Connecting to Vercel API…",
        "📋 Comparing environment variables across Production and Preview…",
        "🔎 Found 11 variables present in Production but missing in Preview…",
        "⚙️  Copying missing variables to Preview environment with safe placeholder values…",
        "✅ Environment variable parity enforced.",
      ],
    },
    {
      id: "vercel-5",
      title: "Enable Deployment Protection for Main Branch",
      description:
        "Production deployments can be triggered without a passing build. Enabling deployment protection will block broken releases.",
      impactScore: 92,
      savings: "~4 hrs/sprint",
      confidence: 96,
      executionLogs: [
        "🔍 Connecting to Vercel API…",
        "📋 Reading deployment protection settings for production project…",
        "[WARN] No required build status check is configured for production.",
        "[Q] Enabling this will block all deployments that fail the build check. Continue?",
        "⚙️  Enabling Deployment Protection with required status: build…",
        "[ERR] API returned 409 Conflict — a stale protection rule is blocking the update.",
        "[RETRY] Removing conflicting legacy rule and retrying…",
        "⚙️  Re-applying Deployment Protection rule…",
        "🔒 Blocking direct production deploys without passing CI…",
        "✅ Deployment protection enabled on production.",
      ],
    },
  ],
  aws: [
    {
      id: "aws-1",
      title: "Right-size Idle EC2 Instances",
      description:
        "Detected 4 EC2 instances running at <10% CPU for 7+ days with no active deployments linked. Schedule auto-stop during non-working hours.",
      impactScore: 89,
      savings: "~7 hrs/sprint",
      confidence: 95,
      executionLogs: [
        "🔍 Connecting to AWS API…",
        "📋 Fetching EC2 instance metrics from CloudWatch…",
        "🔎 Found 4 instances with <10% average CPU over 7 days…",
        "⚙️  Creating AWS Instance Scheduler rule: auto-stop 20:00, auto-start 08:00 Mon–Fri…",
        "🏷️  Tagging instances with schedule:office-hours…",
        "✅ Auto-stop schedule applied to 4 idle EC2 instances.",
      ],
    },
    {
      id: "aws-2",
      title: "Consolidate Staging Environments",
      description:
        "Three separate staging environments exist for one service. Merge into a single shared staging cluster with branch-based namespaces.",
      impactScore: 83,
      savings: "~6 hrs/sprint",
      confidence: 92,
      executionLogs: [
        "🔍 Connecting to AWS API…",
        "📋 Listing ECS clusters and environment tags…",
        "🔎 Found staging-v1, staging-v2, and staging-hotfix clusters for api-service…",
        "⚙️  Generating consolidated Terraform module with namespace-per-branch support…",
        "🚀 Applying Terraform plan to create unified staging cluster…",
        "🗑️  Deregistering and terminating legacy staging clusters…",
        "✅ Staging environments consolidated — infra footprint reduced by 67%.",
      ],
    },
    {
      id: "aws-3",
      title: "Enable S3 Lifecycle Policies",
      description:
        "Log buckets have no lifecycle rules. Adding tiered storage policies will move cold data to Glacier automatically.",
      impactScore: 74,
      savings: "~3 hrs/sprint",
      confidence: 90,
      executionLogs: [
        "🔍 Connecting to AWS API…",
        "📋 Scanning S3 buckets for lifecycle configuration…",
        "🔎 Found 7 buckets with no lifecycle rules…",
        "⚙️  Applying lifecycle policy: transition to Glacier after 90 days…",
        "✅ Lifecycle policies applied to 7 S3 buckets.",
      ],
    },
    {
      id: "aws-4",
      title: "Rotate IAM Access Keys",
      description:
        "3 IAM access keys are older than 90 days. Rotating them enforces least-privilege and reduces credential exposure risk.",
      impactScore: 93,
      savings: "~1 hr/sprint",
      confidence: 99,
      executionLogs: [
        "🔍 Connecting to AWS IAM API…",
        "📋 Auditing IAM user access keys across all users…",
        "🔎 Found 3 access keys created >90 days ago…",
        "[Q] Key aws-deploy-prod is attached to a live production service. Rotate it now?",
        "⚙️  Generating replacement access keys for affected users…",
        "[ERR] PutSecretValue call failed — role arn:aws:iam::prod-deployer lacks Secrets Manager write permission.",
        "[RETRY] Assuming cross-account role with elevated permissions…",
        "🔄 Retrying Secrets Manager update under elevated role…",
        "🔄 Updating application secrets in AWS Secrets Manager…",
        "🗑️  Deactivating and deleting old keys…",
        "✅ IAM access keys rotated — old credentials revoked.",
      ],
    },
    {
      id: "aws-5",
      title: "Configure CloudWatch Alarms for API Errors",
      description:
        "No CloudWatch alarms are set on API Gateway 5xx error rate. Adding them will surface production incidents within minutes.",
      impactScore: 88,
      savings: "~4 hrs/sprint",
      confidence: 94,
      executionLogs: [
        "🔍 Connecting to AWS CloudWatch API…",
        "📋 Listing existing alarms for API Gateway…",
        "🔎 No 5xx error rate alarms found for any stage…",
        "⚙️  Creating CloudWatch alarm: 5xx rate >1% over 5 minutes…",
        "🔔 Wiring alarm to SNS topic → Slack #api-alerts channel…",
        "✅ CloudWatch alarms active on all API Gateway stages.",
      ],
    },
  ],

  gmail: [
    {
      id: "gmail-1",
      title: "You Have Not Responded to a Product Inquiry",
      description:
        "A potential client sent a product inquiry 3 days ago and has received no reply. Unanswered leads go cold within 48 hours on average. Responding now could still recover this opportunity.",
      impactScore: 89,
      savings: "~1 deal",
      confidence: 94,
      executionLogs: [
        "🔍 Connecting to Gmail API…",
        "📋 Scanning inbox for unread messages flagged as product inquiries…",
        '🔎 Found email from contact "David Mercer" received 3 days ago — subject: "Partnership Enquiry – Q4 Proposal"…',
        "⚠️  No reply thread detected. Message still unread.",
        "📝 Drafting suggested response based on previous reply patterns…",
        "📤 Opening draft in Gmail for your review and send…",
        "✅ Suggested response ready — prompt action recommended.",
      ],
    },
    {
      id: "gmail-2",
      title: "Your Client Response Rate Is Below Benchmark",
      description:
        "Your average email response time to clients is 3.2 days. The industry benchmark for professional services is under 24 hours. Slow responses reduce client satisfaction and close rates.",
      impactScore: 84,
      savings: "~8 hrs/week",
      confidence: 91,
      executionLogs: [
        "🔍 Connecting to Gmail API…",
        "📋 Fetching email threads with clients over the last 30 days…",
        "📊 Calculating average response time per contact…",
        "🔎 Identified 14 threads where first response exceeded 48 hours…",
        "⚙️  Generating response time heatmap by day and hour…",
        "📝 Flagging top 5 clients awaiting replies older than 72 hours…",
        "✅ Report ready — recommended: set daily 09:00 email triage block.",
      ],
    },
    {
      id: "gmail-3",
      title: "Important Emails Are Going Unread",
      description:
        "Detected 11 emails from high-value contacts sitting unread in your inbox for over 48 hours. These may contain time-sensitive decisions or approvals.",
      impactScore: 78,
      savings: "~4 hrs/week",
      confidence: 88,
      executionLogs: [
        "🔍 Connecting to Gmail API…",
        "📋 Listing unread emails older than 48 hours…",
        "🔎 Found 11 unread messages from contacts marked as high priority…",
        "⚙️  Applying priority labels and starring flagged messages…",
        "🔔 Scheduling a summary notification for 08:00 tomorrow…",
        "✅ High-priority unread emails flagged and summarised.",
      ],
    },
    {
      id: "gmail-4",
      title: "Follow-Up Emails Are Overdue",
      description:
        "You promised follow-ups in 6 recent email threads but none have been sent. Prospects and clients who are left waiting often disengage after 5–7 business days.",
      impactScore: 82,
      savings: "~3 deals at risk",
      confidence: 90,
      executionLogs: [
        "🔍 Connecting to Gmail API…",
        "📋 Scanning sent mail for phrases indicating a follow-up commitment…",
        '🔎 Found 6 threads containing "I will follow up", "will send", or "by end of week"…',
        "📝 Checking each thread for subsequent replies — none found…",
        "⚙️  Creating follow-up tasks in to-do list for each thread…",
        "✅ 6 overdue follow-ups identified and tasks created.",
      ],
    },
    {
      id: "gmail-5",
      title: "Email Signature Is Outdated",
      description:
        "Your email signature still contains your previous job title and an old phone number. Clients and partners see this on every email, which affects professionalism and reachability.",
      impactScore: 61,
      savings: "~1 hr",
      confidence: 97,
      executionLogs: [
        "🔍 Connecting to Gmail API…",
        "📋 Reading current email signature from account settings…",
        '🔎 Detected title: "Senior Associate" — LinkedIn shows current title: "Head of Product"…',
        "🔎 Phone number +44 7700 900 123 not found in current contact records…",
        "📝 Generating updated signature with correct title and contact info…",
        "⚙️  Applying updated signature to all outgoing email templates…",
        "✅ Email signature updated across all sending identities.",
      ],
    },
  ],

  linkedin: [
    {
      id: "linkedin-1",
      title: "Your Recent Post Is Not Aligned with Your Professional Profile",
      description:
        "Your last 3 LinkedIn posts were about personal topics unrelated to your stated expertise. Misaligned content reduces profile reach and confuses your professional audience.",
      impactScore: 76,
      savings: "~2 hrs/week",
      confidence: 88,
      executionLogs: [
        "🔍 Connecting to LinkedIn API…",
        "📋 Fetching your last 10 published posts…",
        "📊 Comparing post topics against your listed skills and headline…",
        "🔎 3 of last 5 posts have <30% topic relevance to your stated expertise…",
        "📝 Generating content recommendations aligned with your profile niche…",
        "✅ Content alignment report ready — 5 suggested post topics generated.",
      ],
    },
    {
      id: "linkedin-2",
      title: "Your LinkedIn Profile Is Incomplete",
      description:
        "Your profile is missing an About section summary, 4 key skills, and 2 work experience descriptions. Incomplete profiles receive 40% fewer recruiter and client views.",
      impactScore: 83,
      savings: "~Increased visibility",
      confidence: 93,
      executionLogs: [
        "🔍 Connecting to LinkedIn API…",
        "📋 Auditing profile completeness across all sections…",
        "🔎 About section: empty. Skills listed: 3 of 7 recommended.",
        "🔎 Work experience descriptions missing for 2 most recent roles…",
        "📝 Generating draft About section based on your role and skills…",
        "📝 Suggesting 4 additional skills based on peer profiles in your field…",
        "✅ Profile gap report ready — estimated completion boost: +62%.",
      ],
    },
    {
      id: "linkedin-3",
      title: "You Have Unanswered Connection Requests",
      description:
        "You have 14 pending connection requests, some over 30 days old. Several are from potential clients and industry peers. Declining or ignoring them is a missed networking opportunity.",
      impactScore: 68,
      savings: "~14 connections",
      confidence: 85,
      executionLogs: [
        "🔍 Connecting to LinkedIn API…",
        "📋 Fetching pending connection requests…",
        "🔎 Found 14 unanswered requests — oldest is 34 days old…",
        "📊 Categorising requestors: 4 potential clients, 6 industry peers, 4 unknown…",
        "📝 Drafting personalised acceptance messages for priority contacts…",
        "✅ Connection review summary ready — 4 high-priority requests flagged.",
      ],
    },
    {
      id: "linkedin-4",
      title: "Your Post Engagement Rate Is Declining",
      description:
        "Your average post engagement (likes, comments, shares) has dropped 41% over the last 30 days. Early-hour posting and missing hashtags are likely contributing factors.",
      impactScore: 71,
      savings: "~Audience growth",
      confidence: 87,
      executionLogs: [
        "🔍 Connecting to LinkedIn API…",
        "📋 Fetching post analytics for the last 60 days…",
        "📊 Comparing impressions, likes, shares, and comment rates per post…",
        "🔎 Average engagement rate: 1.2% (down from 2.0% last month)…",
        "🔎 Best-performing posts published between 08:00–09:30 on weekdays…",
        "📝 Recommending optimal posting schedule and 5 relevant hashtags…",
        "✅ Engagement analysis complete — scheduling recommendations ready.",
      ],
    },
    {
      id: "linkedin-5",
      title: "Your Profile Photo Does Not Match Your Role",
      description:
        "Your current profile photo was uploaded over 3 years ago and appears informal for your current seniority level. Professional headshots receive 21× more profile views.",
      impactScore: 65,
      savings: "~Profile views +21×",
      confidence: 80,
      executionLogs: [
        "🔍 Connecting to LinkedIn API…",
        "📋 Analysing current profile photo metadata and quality…",
        "🔎 Photo uploaded: 3 years ago. Resolution: 200×200 (below recommended 400×400)…",
        "🔎 Photo style assessed as casual — peers at similar seniority use professional headshots…",
        "📝 Generating recommendation: update with high-resolution professional headshot…",
        "✅ Profile photo audit complete — update recommended for maximum impact.",
      ],
    },
  ],
};

// Universal insights for other connectors
const universalInsights: Insight[] = [
  {
    id: "universal-1",
    title: "Audit API Rate Limits and Usage",
    description:
      "Review current API consumption patterns and optimise throttling to prevent rate limit errors and improve system reliability.",
    impactScore: 75,
    savings: "~3 hrs/sprint",
    confidence: 88,
    executionLogs: [
      "🔍 Authenticating with connector API…",
      "📋 Fetching rate limit and quota data…",
      "🔎 Analysing request volume over the last 7 days…",
      "⚙️  Applying request throttling configuration…",
      "✅ API rate limit audit complete.",
    ],
  },
  {
    id: "universal-2",
    title: "Implement Data Caching Strategy",
    description:
      "Reduce API calls by implementing intelligent caching for frequently accessed data, improving response times and reducing build flakiness.",
    impactScore: 78,
    savings: "~4 hrs/sprint",
    confidence: 86,
    executionLogs: [
      "🔍 Authenticating with connector API…",
      "📋 Identifying high-frequency read endpoints…",
      "⚙️  Configuring in-memory cache with 5-minute TTL…",
      "🚀 Deploying cache layer to staging for validation…",
      "✅ Caching strategy implemented.",
    ],
  },
  {
    id: "universal-3",
    title: "Rotate & Scope API Credentials",
    description:
      "Review API keys, tokens, and permissions. Rotate stale credentials and scope to least-privilege to improve security posture.",
    impactScore: 82,
    savings: "~2 hrs/sprint",
    confidence: 91,
    executionLogs: [
      "🔍 Authenticating with connector API…",
      "📋 Auditing existing API tokens and scopes…",
      "⚠️  Found credentials with excessive permission scopes…",
      "⚙️  Generating new least-privilege credentials…",
      "🗑️  Revoking old tokens…",
      "✅ Credentials rotated and scoped successfully.",
    ],
  },
  {
    id: "universal-4",
    title: "Enable Webhook Event Deduplication",
    description:
      "Implement webhook deduplication logic to prevent duplicate event processing and reduce unnecessary database operations.",
    impactScore: 71,
    savings: "~2 hrs/sprint",
    confidence: 84,
    executionLogs: [
      "🔍 Authenticating with connector API…",
      "📋 Reading webhook delivery logs…",
      "🔎 Found duplicate event IDs in 12% of deliveries…",
      "⚙️  Adding idempotency key check to event handler…",
      "✅ Webhook deduplication logic enabled.",
    ],
  },
  {
    id: "universal-5",
    title: "Consolidate Redundant Integrations",
    description:
      "Audit integration setup for overlapping functionality. Merge similar connectors to simplify maintenance and cut on-call overhead.",
    impactScore: 74,
    savings: "~3 hrs/sprint",
    confidence: 85,
    executionLogs: [
      "🔍 Authenticating with connector API…",
      "📋 Mapping all active integrations and their feature overlaps…",
      "🔎 Identified 2 connectors with duplicated functionality…",
      "⚙️  Migrating data streams to consolidated connector…",
      "✅ Redundant integrations merged.",
    ],
  },
  {
    id: "universal-6",
    title: "Monitor Data Sync Performance",
    description:
      "Implement real-time monitoring for sync latency, error rates, and data quality metrics to surface bottlenecks before they impact deployments.",
    impactScore: 69,
    savings: "~2 hrs/sprint",
    confidence: 80,
    executionLogs: [
      "🔍 Authenticating with connector API…",
      "📋 Sampling sync job latency over last 24 hours…",
      "⚙️  Configuring performance monitor with p95 latency threshold…",
      "🔔 Wiring alerts to #data-ops Slack channel…",
      "✅ Sync performance monitoring active.",
    ],
  },
];

/**
 * Generate insights for a specific connector
 * Returns 2 insights per connector
 */
export const generateInsightsForConnector = (
  connector: ConnectedConnector,
  index: number,
): Insight[] => {
  const connectorName = connector.name.toLowerCase().replace(/\s+/g, "");

  // Check if it's a priority connector
  for (const [priority, insights] of Object.entries(priorityInsights)) {
    if (
      connectorName.includes(priority) ||
      priority.includes(connectorName.split("-")[0])
    ) {
      return insights.map((insight) => ({
        ...insight,
        connectorName: connector.name,
      }));
    }
  }

  // For non-priority connectors, pick 5 universal insights cycling from the pool
  return Array.from({ length: 5 }, (_, i) => {
    const insight =
      universalInsights[(index * 5 + i) % universalInsights.length];
    return {
      ...insight,
      id: `${connector.id}-insight-${i + 1}`,
      title: `${insight.title} — ${connector.name}`,
      connectorName: connector.name,
    };
  });
};

/**
 * Generate all insights from connected connectors
 * Returns array of insights sorted by impact score (descending)
 */
export const generateAllInsights = (
  connectedConnectors: ConnectedConnector[],
): Insight[] => {
  const allInsights: Insight[] = [];

  connectedConnectors.forEach((connector, index) => {
    const connectorInsights = generateInsightsForConnector(connector, index);
    allInsights.push(...connectorInsights);
  });

  // Sort by impact score descending for better UX
  return allInsights.sort((a, b) => b.impactScore - a.impactScore);
};
