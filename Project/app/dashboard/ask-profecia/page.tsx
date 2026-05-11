'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  MessageSquare,
  Plus,
  ChevronDown,
  Paperclip,
  Send,
  Download,
  ArrowRight,
  Loader,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import GenericModal from '@/components/GenericComponents/GenericModal';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { getConnectorIcon } from '@/lib/utils/connectorIconUtils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  suggestedQuestionsBank,
  assistantResponsesBank,
} from '@/data/suggestedFollowUpPrompts';
import { useActionStore } from '@/lib/store/actionStore';
import {
  generateAllInsights,
  generateInsightsForConnector,
} from '@/lib/utils/insightsGenerator';
import { Button } from '@mui/material';

type Connector = { id: string; name: string; active: boolean };
type Message = { role: 'user' | 'assistant'; content: string };
type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  attachments: string[];
};

const initialConversations: Conversation[] = [
  { id: 'c1', title: 'Chat', messages: [], attachments: [] },
];

function AccordionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className='rounded-xl border  border-light-border  bg-light-surface/60 dark:bg-dark-surface/60'>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center cursor-pointer justify-between px-4 py-3 ${open ? 'border-b border-light-border' : ''}`}
      >
        <span className='font-medium'>{title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='overflow-hidden p-4 space-y-3'
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const connectorPredefinedQuestions: Record<string, string[]> = {
  github: [
    'How many open pull requests do I have across all repos?',
    "Which branches haven't been merged in 30+ days?",
    'What is the current CI/CD pipeline success rate?',
    'Show me the top contributors this month.',
  ],
  slack: [
    'Which channels have been inactive for more than 7 days?',
    'How many unread direct messages do I have?',
    'What are the most active channels this week?',
    'Show me messages where I was mentioned today.',
  ],
  jira: [
    "What's my current sprint burndown rate?",
    'Which tickets are blocking the current sprint?',
    'How many open issues are assigned to me?',
    "What's the average resolution time for bugs this month?",
  ],
  'amazon web services (aws)': [
    'When was the last time I took a backup of this database?',
    'How many S3 buckets do I have?',
    'Which EC2 instances are currently running?',
    'What is my estimated AWS bill for this month?',
  ],
  'microsoft azure': [
    'How many active resources are in my subscription?',
    'Which pipelines failed in the last 24 hours?',
    'What is the current resource utilization across my VMs?',
    'Show me recent security alerts from Azure Security Center.',
  ],
  gmail: [
    'How do I respond to pending product inquiries?',
    'What can I do to improve my client response rate?',
    'Which important emails am I missing?',
    'What follow-up emails do I need to send?',
    'Is my email signature up to date?',
  ],
  linkedin: [
    'How can I align my posts with my professional profile?',
    'What sections of my LinkedIn profile need completion?',
    'How many pending LinkedIn connection requests do I have?',
    'Why is my LinkedIn post engagement declining?',
    'Should I update my LinkedIn profile photo?',
  ],
};

function getQuestionsForConnector(connectorName: string): string[] {
  const key = connectorName.toLowerCase();
  if (connectorPredefinedQuestions[key])
    return connectorPredefinedQuestions[key];
  const partial = Object.keys(connectorPredefinedQuestions).find(
    (k) => key.includes(k) || k.includes(key),
  );
  return partial ? connectorPredefinedQuestions[partial] : [];
}

const predefinedAnswers: Record<string, string> = {
  // ── GitHub (Action Feed) ──
  'Optimise CI/CD Pipeline Performance':
    'About Optimise CI/CD Pipeline Performance: Your CI/CD pipeline is the automated system that builds, tests, and deploys your code every time a change is made. We found 3 jobs doing duplicate work across your `profecia-ui` and `api-service` workflows. By reorganising them to run at the same time instead of one after another, your average build time would drop from about 14 minutes to 8.5 minutes — a 38% speed improvement. That saves your team roughly 6 hours of waiting time every sprint.',
  'Reduce PR Review Cycle Time':
    'About Reduce PR Review Cycle Time: A Pull Request (PR) is a code change waiting to be reviewed and approved before it goes live. Right now, 12 pull requests have been waiting for a reviewer for over 72 hours — including `fix/auth-token-refresh`, `feat/dark-mode`, and `chore/deps-upgrade` — because nobody is automatically assigned to review them. Setting up auto-assignment rules means the right person is notified immediately, cutting your average review wait from 4.2 days to under 24 hours.',
  'Enforce Branch Protection Rules':
    'About Enforce Branch Protection Rules: Branch Protection Rules are safeguards that stop unreviewed or broken code from being pushed directly to your live codebase. Currently your `main` branch has no such protection — anyone can push directly without a review or passing tests. Turning this on (requiring a Pull Request and passing automated checks before merging) prevents accidental outages and is a widely recognised security best practice.',
  'Archive Stale Repositories':
    'About Archive Stale Repositories: Archiving a repository means putting an old, unused project into a read-only state so it no longer clutters your active workspace. We found 6 repositories with zero activity for over 90 days. They still show up in searches, use up your build quota, and confuse new team members. Archiving them removes them from active views while keeping all history safe, reducing your visible project count by about 30%.',
  'Rotate Expired Deploy Tokens':
    'About Rotate Expired Deploy Tokens: Deploy Tokens act like passwords that allow automated systems to access your code. Rotating them means replacing old tokens with new ones as a security precaution. We found 2 tokens that are over 180 days old and have never been changed. Old tokens are a security risk — if they were ever exposed, someone could access your repositories. Replacing them takes under 10 minutes and immediately removes that risk.',

  // ── Slack (Action Feed) ──
  'Streamline Incident Alert Routing':
    'About Streamline Incident Alert Routing: This means making sure the right alerts go to the right place — and only once. Currently 3 of your Slack channels (`#alerts`, `#ops-alerts`, and `#infra-incidents`) are all receiving the same notifications for the same events. Your team sees every alert 3 times, which leads to alert fatigue — people start ignoring them. Merging these into one `#incidents` channel with clear priority labels would cut the duplicate noise by about 70%.',
  'Automate Standup Summaries':
    'About Automate Standup Summaries: A standup summary is a quick daily update on what the team is working on and any blockers. We found that 94% of messages in your `#standup` channel follow the exact same manual format every day — meaning people are typing out the same structure repeatedly. By connecting Profecia to automatically post a Jira-based summary each morning at 09:00, your team saves about 20 minutes per person per day with more accurate, up-to-date information.',
  'Clean Up Unused Public Channels':
    'About Clean Up Unused Public Channels: This means removing Slack channels that no one is actively using anymore. We found 18 channels with no new messages in over 30 days — including `#q2-planning`, `#ops-alerts-old`, and `#frontend-legacy`. These old channels clutter the sidebar, make search harder, and slow down new team members trying to find the right place to communicate. Archiving them is instant and fully reversible — all message history is kept.',
  'Enable Do-Not-Disturb Schedules':
    'About Enable Do-Not-Disturb Schedules: A Do-Not-Disturb (DND) schedule stops Slack notifications from coming through outside of work hours. We found 11 team members with no DND schedule set up, meaning they receive notifications at all hours — including late nights and weekends. There is a clear pattern of messages being sent between 21:00 and 07:00. Setting a quiet period (18:00–09:00 local time) for these users reduces after-hours interruptions and supports a healthier work-life balance.',
  'Sync Slack Status with Jira Sprints':
    "About Sync Slack Status with Jira Sprints: This means automatically updating each team member's Slack status to show what they are currently working on, based on their active Jira tickets. Right now, 9 team members have generic or blank statuses. When colleagues can't see at a glance who is working on what, they send unnecessary messages or set up meetings to find out. Auto-updating statuses from the sprint board makes everyone's work visible with zero extra effort.",

  // ── Jira (Action Feed) ──
  'Reduce Sprint Carryover Rate':
    'About Reduce Sprint Carryover Rate: Sprint Carryover Rate is the percentage of planned tasks that do not get completed within a sprint. Your current rate is 28% — roughly 1 in 4 tasks carries over to the next sprint. Looking at the data, the main cause is 9 tasks estimated as very large (over 8 story points), which consistently run over time. Breaking these large tasks into smaller pieces of 2–3 points each would make sprints more predictable and less stressful.',
  'Clear Stale Backlog Tickets':
    'About Clear Stale Backlog Tickets: Your Jira Backlog is the full list of all planned future work. We found 47 tickets with no activity in over 60 days — they are still on the list but nobody is actively planning to work on them. This makes sprint planning longer and harder, and makes it difficult to tell what is truly important. Closing or archiving these tickets would reduce your backlog by about 35% and make planning sessions significantly faster.',
  'Standardise Issue Templates':
    'About Standardise Issue Templates: An Issue Template is a pre-filled form that guides team members when they report a bug or request a feature. Currently 63% of recent bug reports are missing key information — like how to reproduce the issue, what environment it happened in, or what was expected vs. what actually happened. This forces developers to go back and ask for more details before they can start work, adding 1–2 days to the fix time. A required template solves this immediately.',
  'Auto-link PRs to Jira Tickets':
    'About Auto-link PRs to Jira Tickets: This means automatically connecting every code change (Pull Request) to the task it belongs to in Jira. Currently 58% of recent pull requests have no linked Jira ticket, making it impossible to trace which code change fixes which task, generate accurate release notes, or measure team output reliably. Setting up the Jira–GitHub integration and a PR template takes about 30 minutes and gives you full traceability from task to code.',
  'Set Up Velocity Trend Alerts':
    "About Set Up Velocity Trend Alerts: Velocity Trend Alerts notify you when your team's output is dropping — before it becomes a delivery problem. Velocity measures how many story points (units of work) your team completes per sprint. Your team's average over the last 6 sprints is 42 points. No alert is currently configured, so if output dropped significantly you would only notice after the sprint ended. Setting an alert for when velocity falls below 32 points gives you early warning while there is still time to act.",

  // ── Notion (Action Feed) ──
  'Consolidate Duplicate Tech Docs':
    'About Consolidate Duplicate Tech Docs: This means merging multiple copies of the same document into one clear, authoritative source. We found 4 separate step-by-step guides all covering the same `auth-service` setup — written at different times by different engineers. They contain conflicting information, but all 4 are being actively used. Combining them into one versioned document removes the confusion and makes it much faster for new engineers to get up to speed.',
  'Add ADR Templates to Codebase Docs':
    'About Add ADR Templates to Codebase Docs: An ADR (Architecture Decision Record) is a short document that explains why a technical decision was made — not just what was decided. We found 8 significant decisions made in the last 6 months with no ADR. Without these records, future team members spend hours figuring out the reasoning behind a decision before they can safely change it. Adding lightweight ADR templates for each undocumented decision takes a few hours now but prevents far greater time loss later.',
  'Sync Sprint Goals to Team Wiki':
    "About Sync Sprint Goals to Team Wiki: This means publishing your current development priorities to a shared Notion wiki so that the whole organisation — not just engineers — can see what the team is working on. Right now, sprint goals only exist inside Jira, which product managers, designers, and leadership don't regularly check. Syncing to the wiki keeps everyone aligned and reduces the 'what is the team working on this sprint?' question in meetings.",
  'Tag and Categorise Untagged Pages':
    "About Tag and Categorise Untagged Pages: Tags and categories in Notion help people find documents through filters and search. We found 62 pages with no tags — they are effectively hidden unless you already know they exist. They won't show up in filtered database views or organised search results. Running an automatic categorisation based on page titles and content would immediately make these documents discoverable and useful.",
  'Archive Outdated Meeting Notes':
    "About Archive Outdated Meeting Notes: This means moving old meeting records out of your active Notion workspace into a storage area. We found 34 meeting notes older than 6 months still sitting in the main workspace. They push current notes further down, make searches noisier, and can mislead team members who aren't sure if the decisions in those old notes are still valid. Moving them to an Archive section preserves all history while keeping the working area clean.",

  // ── Vercel (Action Feed) ──
  'Optimise Preview Deployment Cadence':
    'About Optimise Preview Deployment Cadence: A preview deployment is a live test version of your app created automatically for every code change. Right now all 4 of your Vercel projects create a preview on every single commit — even for small documentation edits. This wastes build time and slows down the queue for changes that actually need review. By only triggering deployments when real source code or public files change, you would eliminate about 40% of unnecessary builds.',
  'Enable Edge Caching for Static Routes':
    'About Enable Edge Caching for Static Routes: Edge Caching stores copies of your web pages closer to your visitors around the world so they load faster. Currently 6 of your most-visited pages are rebuilt from scratch on every single visit, even though their content rarely changes. This causes an average load time of about 800ms. Enabling caching with a 1-hour refresh window would reduce that to under 100ms — an 8× speed improvement that users will notice immediately.',
  'Clean Up Orphaned Preview Deployments':
    'About Clean Up Orphaned Preview Deployments: Orphaned Preview Deployments are old test versions of your site still listed in your Vercel dashboard even though the code branches they came from have been deleted from GitHub. We found 23 of these. They serve no purpose but clutter your deployment history and make it harder to find recent, relevant deployments. Deleting them is instant and safe — your live site and actual code are completely unaffected.',
  'Enforce Environment Variable Hygiene':
    'About Enforce Environment Variable Hygiene: Environment Variables are settings like API keys and database addresses that your app needs to run correctly. Hygiene means keeping them consistent across all environments. We found 11 variables that exist in Production but are missing from your Preview environment. This means preview versions of your app are silently running with incomplete settings, causing errors that only show up later in production.',
  'Enable Deployment Protection for Main Branch':
    'About Enable Deployment Protection for Main Branch: Deployment Protection is a safety rule that stops a broken version of your app from going live. Right now, even if your automated tests fail, a deployment can still reach production. This is a critical gap — one failed build going live could cause a full outage for all your users. Enabling this protection means a deployment is automatically blocked until all required checks pass.',

  // ── AWS (Action Feed) ──
  'Right-size Idle EC2 Instances':
    'About Right-size Idle EC2 Instances: EC2 Instances are virtual servers running in the cloud. Right-sizing means adjusting their size and cost to match how much they are actually being used. We found 4 servers running at under 10% capacity for over 7 days — they are essentially idle but still charging you 24 hours a day. Setting them to automatically switch off in the evenings and back on in the mornings on weekdays would save about 60 idle hours per week per server — reducing their cost by around 30%.',
  'Consolidate Staging Environments':
    'About Consolidate Staging Environments: Staging Environments are test versions of your application used before changes go live. You are currently running 3 separate staging setups (`staging-v1`, `staging-v2`, `staging-hotfix`) for what is effectively one service — each with its own server, load balancer, and monitoring. Merging them into one shared staging environment would reduce your staging infrastructure by 67% and make deployments much simpler to manage.',
  'Enable S3 Lifecycle Policies':
    'About Enable S3 Lifecycle Policies: S3 Lifecycle Policies are rules that automatically move or delete files in your cloud storage after a set period of time. We found 7 storage buckets — mostly used for logs — with no lifecycle rules at all. Log files older than 90 days are almost never accessed but are still stored at full price. Moving them to cheaper archival storage (Glacier) after 90 days would cut storage costs on these buckets by about 70%, with no change to how you access them.',
  'Rotate IAM Access Keys':
    'About Rotate IAM Access Keys: IAM Access Keys are like usernames and passwords for automated systems that access your AWS account. Rotating them means replacing old keys with new ones as a regular security practice. We found 3 keys that are over 90 days old — the recommended maximum before rotation. One of them (`aws-deploy-prod`) is actively used by a live production service, making it the highest risk. Rotating all three brings you into compliance with SOC 2 and ISO 27001 security standards.',
  'Configure CloudWatch Alarms for API Errors':
    'About Configure CloudWatch Alarms for API Errors: CloudWatch Alarms are automated notifications that alert you when something goes wrong in your AWS setup. Currently no alarm is configured to detect error spikes in your API. This means if your API starts failing for users, you would only find out when customers report it — potentially hours later. Setting up an alarm to trigger when error rates exceed 1% over 5 minutes, with a Slack notification to `#api-alerts`, gives your team sub-5-minute incident detection.',

  // ── GitHub (predefined) ──
  'How many open pull requests do I have across all repos?':
    'Across all your repositories, you currently have 14 open Pull Requests (PRs) — proposed code changes waiting to be reviewed and approved. 3 of these have been waiting for a reviewer for over 72 hours: `fix/auth-token-refresh` in api-service, `feat/dark-mode` in profecia-ui, and `chore/deps-upgrade` in backend-core. Setting up auto-assignment rules would ensure the right person is notified the moment a PR is opened, reducing these long waits.',
  "Which branches haven't been merged in 30+ days?":
    'A branch is a separate copy of the codebase where work-in-progress changes are developed. We found 8 branches with no new activity or merges in over 30 days: `feature/legacy-auth`, `experiment/graphql-layer`, `fix/old-pagination`, and 5 others. 2 still have open pull requests that appear abandoned. Archiving or deleting these cleans up the repository and makes it much easier to see which work is actually active.',
  'What is the current CI/CD pipeline success rate?':
    'Your CI/CD pipeline is the automated system that runs tests and builds your app every time code is pushed. Over the last 7 days, the overall success rate is 76% — meaning roughly 1 in 4 runs is failing. The `api-service` pipeline has the most failures (3 in 24 hours), caused by an unstable test in the auth module. The `frontend-deploy` pipeline is healthier at 91%. Isolating the unstable test and running jobs in parallel would improve both speed and reliability.',
  'Show me the top contributors this month.':
    'Here are the top 3 contributors by merged pull requests this month: 1. @alex_dev — 18 PRs merged, 4,200 lines of code added. 2. @priya.eng — 12 PRs merged, 2,800 lines added. 3. @marcus_b — 9 PRs merged, 1,600 lines added. The team as a whole merged 47 PRs this month — a 22% improvement compared to last month.',

  // ── Slack (predefined) ──
  'Which channels have been inactive for more than 7 days?':
    'We found 6 Slack channels with no new messages in over 7 days: #q2-planning, #ops-alerts-old, #frontend-legacy, #temp-migration-2024, #sprint-12-review, and #infra-staging. Inactive channels clutter the sidebar, make it harder to find active conversations, and slow down new team members getting oriented. Archiving them removes them from view while keeping all message history — it is completely reversible.',
  'How many unread direct messages do I have?':
    'You have 23 unread direct messages across 7 conversations. The oldest is 3 days old — from @priya.eng about an API documentation review. 4 are marked urgent: prioritise @alex_dev (deployment question) and @team-lead (sprint planning update) first. The remaining messages are lower priority but have been waiting more than 24 hours.',
  'What are the most active channels this week?':
    "The 3 most active Slack channels this week are: 1. #dev-general — 312 messages, 18 team members participated. 2. #incident-2026-04 — 189 messages, 12 members (created for last Tuesday's outage). 3. #deployments — 147 messages, 9 members. Overall activity is up 14% compared to last week, largely driven by the ongoing incident discussion.",
  'Show me messages where I was mentioned today.':
    'You were mentioned 7 times across 4 channels today. Key ones to action: @alex_dev asked for your review on the `feat/payment-gateway` pull request in #dev-general (2 hours ago), and @priya.eng tagged you in #deployments about the staging rollout status (45 minutes ago). There are also 3 mentions in the #sprint-review thread where your input on velocity data was requested.',

  // ── Jira (predefined) ──
  "What's my current sprint burndown rate?":
    "Your Sprint Burndown shows how much work has been completed versus how much remains. Sprint 24 is at 62% completion with 4 days left — you have resolved 31 out of 50 planned story points. Ideal pace at this stage would be around 70%, so you are slightly behind. The biggest blockers are 3 tickets that have been stuck in 'In Progress' for over 3 days without updates: PROJ-418, PROJ-421, and PROJ-433.",
  'Which tickets are blocking the current sprint?':
    'There are 4 tickets currently blocking progress in Sprint 24: PROJ-418 (API rate limiting — waiting for infrastructure approval), PROJ-421 (Auth service refactor — blocked by an unmerged pull request), PROJ-433 (Database migration — waiting for DBA sign-off), and PROJ-441 (Third-party SDK update — waiting on a vendor response). Together these account for 14 blocked story points.',
  'How many open issues are assigned to me?':
    "You have 11 open Jira issues assigned to you: 2 in 'To Do', 7 in 'In Progress', and 2 in 'In Review'. Highest priority: PROJ-418 (P1 blocker, due today) and PROJ-429 (P2 bug, due in 2 days). Your oldest unresolved issue is PROJ-397, open for 18 days — worth reassessing whether it is still relevant.",
  "What's the average resolution time for bugs this month?":
    'This month, bugs are being resolved in an average of 3.4 days — an improvement from 4.8 days last month. Critical (P1) bugs are turned around in an average of 6.2 hours. Standard (P2) bugs average 2.1 days. The slowest category is frontend styling bugs at 5.7 days on average, mainly because they require cross-browser testing before closing.',

  // ── AWS (predefined) ──
  'When was the last time I took a backup of this database?':
    'Your main production database (`prod-postgres-main`) was last backed up 14 hours ago at 02:00 UTC — an automated daily snapshot stored in `profecia-db-backups-prod` with a 30-day retention policy, so you have 30 days of recovery points available. One concern: the `staging-mysql-01` database has not been backed up in 3 days because the automated job failed on April 24 with a permissions error. This should be investigated soon.',
  'How many S3 buckets do I have?':
    'You have 12 S3 buckets (cloud storage containers) in your AWS account: 4 for production data, 3 for staging, 2 for logs and audit records, and 3 that are untagged (potentially leftover from old projects). Total storage used: 847 GB. One concern: 2 buckets — `legacy-assets-2023` and `temp-uploads-q1` — do not have public access fully blocked, which is a potential security risk worth reviewing.',
  'Which EC2 instances are currently running?':
    'You have 9 virtual servers (EC2 instances) currently running across 2 regions — US East and Europe West. Breakdown: 4 production servers (t3.large), 3 staging/testing servers (t3.medium), and 2 development sandboxes (t3.small). Average CPU usage over the last hour is 34%, which is healthy. One flag: instance `i-0a3b2c1d` in US East has been at 87% CPU for the past hour and may need to be upgraded or its workload reviewed.',
  'What is my estimated AWS bill for this month?':
    "Your estimated AWS bill for April 2026 is $2,847.60 so far. The biggest costs are: virtual servers (EC2) at $1,240 (44%), databases (RDS) at $620 (22%), file storage (S3) at $380 (13%), data transfer at $340 (12%), and other services at $267 (9%). Spending is up 8% compared to last month, driven by extra server usage during last week's load testing. You are on track with no unexpected overage.",

  // ── Azure (predefined) ──
  'How many active resources are in my subscription?':
    'Your Azure subscription contains 47 active resources spread across 3 resource groups: rg-production (23 resources), rg-staging (16 resources), and rg-shared-services (8 resources). These include 8 Virtual Machines, 4 App Services (web hosting), 6 Storage Accounts, 3 SQL Databases, and various networking and monitoring components. All resources are accounted for with no untagged orphans detected.',
  'Which pipelines failed in the last 24 hours?':
    '3 Azure DevOps pipelines (automated build and deploy processes) failed in the last 24 hours: `prod-api-deploy` at 14:32 UTC (Docker container build timed out), `staging-frontend` at 09:15 UTC (a package dependency conflict), and `data-pipeline-etl` at 22:00 UTC (could not connect to an external API). The `prod-api-deploy` failure is the most critical — it blocked the planned production release.',
  'What is the current resource utilization across my VMs?':
    'Across your 8 Azure Virtual Machines, average CPU is 41% and average memory is 58% — both within healthy ranges. However, `vm-api-prod-01` has been above 80% CPU for the last 6 hours, which is a warning sign and may need upgrading. On the other end, `vm-worker-03` and `vm-worker-04` are barely being used (under 15% CPU) and could be downsized to save an estimated $180 per month.',
  'Show me recent security alerts from Azure Security Center.':
    'Azure Security Center has flagged 5 active alerts. Most serious (High): a brute-force attack on `vm-api-prod-01` — 147 failed login attempts from the same IP address over 12 hours. Medium alerts: outdated OS patches on `vm-worker-02` and `vm-worker-04`. Low: an unused firewall rule to clean up. Recommended actions: enable Just-In-Time VM access to block unauthorised logins, and apply the outstanding OS patches immediately.',

  // ── Notion (predefined) ──
  'What pages have been updated in the last 7 days?':
    "18 Notion pages have been updated in the last 7 days. The most actively edited are: 'Sprint 24 Planning' (updated 4 times by 3 different team members), 'API Documentation v2' (a major update by @alex_dev 2 days ago), and 'Incident Report — April 22' (updated yesterday). By workspace: 6 updates in Engineering, 5 in Product, and 7 in Operations.",
  'Show me all tasks assigned to me across databases.':
    "You have 9 open tasks assigned to you across Notion databases: 3 in 'Engineering Backlog' (2 due this week), 4 in 'Product Roadmap' (all in progress), and 2 in 'Team OKRs' (quarterly check-ins). Most urgent: 'Review API schema changes', due tomorrow. You also have 2 overdue tasks: 'Update onboarding docs' (3 days late) and 'Q1 retrospective notes' (5 days late).",
  'Which projects are currently in progress?':
    "4 projects are currently marked 'In Progress': 'Platform v2 Redesign' at 65% complete, 'Data Pipeline Optimisation' at 40%, 'Security Audit Q2' at 80% (due this Friday — most at risk), and 'Developer Onboarding Revamp' at 25%. The Security Audit is the most time-sensitive and should be prioritised this week.",
  'What documentation pages have not been updated in 90+ days?':
    "We found 12 documentation pages that have not been updated in over 90 days: 'Legacy API Reference v1' (8 months old), 'Old Deployment Runbook' (6 months), 'Q3 2025 Planning Archive' (7 months), and 9 others. The concern is that 4 of these are still linked from active documents — meaning team members might be following outdated instructions without realising it. These should be archived or updated.",

  // ── Vercel (predefined) ──
  'What is the current deployment status of my projects?':
    "You have 7 projects hosted on Vercel. 5 are in a healthy 'Ready' state with their most recent deployments successful. 1 project (`profecia-dashboard`) has a stale deployment from 3 days ago — it hasn't been updated recently. 1 project (`api-gateway-edge`) is in a failed state from 2 hours ago and needs attention. All production websites are currently live and serving visitors normally.",
  'Show me failed deployments in the last 24 hours.':
    '2 deployments failed in the last 24 hours: `api-gateway-edge` failed at 10:14 UTC due to a TypeScript type error in `middleware.ts` at line 47, and `marketing-site` failed at 07:30 UTC due to a conflict between two packages (`react-dom@18` and `@company/ui-kit@1.2.3`). The `api-gateway-edge` failure is higher priority — it is preventing the latest API changes from going live.',
  'Which functions have the highest error rate?':
    "Serverless Functions are small pieces of backend code that run on demand. The 3 with the highest error rates in the last 24 hours are: 1. `/api/auth/refresh` — 4.2% error rate (23 errors, mostly expired login sessions). 2. `/api/webhooks/stripe` — 2.8% error rate (12 errors, payment signature checks failing). 3. `/api/data/export` — 1.9% error rate (8 timeouts hitting the 10-second limit). The export function's time limit should be increased.",
  'What is my bandwidth usage this month?':
    'Bandwidth is the total data transferred between your Vercel servers and your visitors. This month you have used 34.7 GB out of your 100 GB Pro plan (34.7%, with 3 days remaining). By project: `profecia-dashboard` is the heaviest at 18.2 GB (52%), followed by `api-gateway-edge` at 9.4 GB (27%), `marketing-site` at 5.8 GB (17%), and others at 1.3 GB. You are on track — no overage expected this month.',

  // ── Gmail (Action Feed) ──
  'How do I respond to pending product inquiries?':
    "About You Have Not Responded to a Product Inquiry: A potential client named David Mercer sent you a product inquiry 3 days ago with the subject 'Partnership Enquiry – Q4 Proposal'. He hasn't received any reply yet. Research shows that leads go cold within 48 hours on average, so this opportunity is at risk. Profecia has drafted a suggested response based on your previous email patterns — it's ready for your review in your Gmail drafts. Sending it today could still recover the conversation.",

  'What can I do to improve my client response rate?':
    'About Your Client Response Rate Is Below Benchmark: Your average reply time to client emails over the last 30 days is 3.2 days. The professional services industry benchmark is under 24 hours. We identified 14 email threads where your first response took longer than 48 hours — including messages from 3 active clients. The pattern shows most delays happen on Mondays and Fridays. Setting aside a 30-minute email triage block each morning at 09:00 would bring your response rate into the healthy range and protect client relationships.',

  'Which important emails am I missing?':
    'About Important Emails Are Going Unread: There are 11 emails from high-value contacts sitting unread in your inbox for over 48 hours. These include messages from clients, a potential partner, and two time-sensitive approval requests. Because they are buried under less important mail, they risk being missed entirely. Profecia has applied priority labels and starred each one so they are visible at the top of your inbox. A summary digest has been scheduled for 08:00 tomorrow so nothing slips through.',

  'What follow-up emails do I need to send?':
    "About Follow-Up Emails Are Overdue: In 6 recent email conversations, you committed to following up — using phrases like 'I will send this by end of week' or 'I will follow up shortly' — but no follow-up was ever sent. Prospects and clients who are waiting for a promised reply often disengage after 5 to 7 business days without a response. Profecia has created a task for each of these 6 threads so you can follow up quickly. Acting today will show professionalism and keep these opportunities alive.",

  'Is my email signature up to date?':
    "About Email Signature Is Outdated: Your current email signature still shows your previous job title 'Senior Associate' and a phone number that no longer appears in your contact records. Your LinkedIn profile shows your current title as 'Head of Product'. Every email you send goes out with this outdated information — which can undermine trust with clients who research you before a meeting. Profecia has prepared an updated signature with your current title, phone number, and a link to your LinkedIn profile. It's ready to apply in one click.",

  // ── LinkedIn (Action Feed) ──
  'How can I align my posts with my professional profile?':
    "About Your Recent Post Is Not Aligned with Your Professional Profile: Your last 3 LinkedIn posts covered personal topics unrelated to the expertise areas listed in your profile headline and skills. When your content doesn't match your professional brand, LinkedIn's algorithm reduces its reach and your target audience is less likely to engage. Profecia has compared your post topics against your listed skills and generated 5 content ideas that are tightly aligned with your stated expertise — these are likely to reach more of the right people and attract more relevant profile visits.",

  'What sections of my LinkedIn profile need completion?':
    'About Your LinkedIn Profile Is Incomplete: Your LinkedIn profile is currently missing an About section, 4 skills from your recommended set, and work experience descriptions for your 2 most recent roles. Incomplete profiles receive 40% fewer views from recruiters and potential clients. Profecia has drafted an About section based on your career history and current role, suggested 4 additional skills based on what similar professionals in your field typically list, and outlined what to include in your experience descriptions. Adding these sections should take under 30 minutes.',

  'How many pending LinkedIn connection requests do I have?':
    'About You Have Unanswered Connection Requests: You currently have 14 pending LinkedIn connection requests. Some have been waiting for over 30 days. Among these, 4 appear to be from potential clients based on their industry and role, and 6 are industry peers in your field. Connection requests that are ignored for too long expire or leave a negative impression. Profecia has categorised the requests by priority and drafted short personalised acceptance messages for the 4 highest-priority contacts so you can accept and start conversations efficiently.',

  'Why is my LinkedIn post engagement declining?':
    'About Your Post Engagement Rate Is Declining: Your average LinkedIn post engagement — the combined total of likes, comments, and shares — has dropped 41% over the last 30 days, from 2.0% down to 1.2%. Analysis of your post history shows that your best-performing posts were published between 08:00 and 09:30 on weekdays, but your last 5 posts went live in the afternoon or evening. You are also not using hashtags, which limits organic reach. Profecia recommends shifting to a morning posting schedule and has suggested 5 relevant hashtags aligned to your niche.',

  'Should I update my LinkedIn profile photo?':
    "About Your Profile Photo Does Not Match Your Role: Your current LinkedIn photo was uploaded over 3 years ago, has a resolution of 200×200 pixels (below LinkedIn's recommended 400×400), and appears informal compared to profiles of people at your current seniority level. Studies show that a professional headshot receives up to 21 times more profile views than a casual or low-quality photo. Updating your photo with a high-resolution professional headshot is one of the quickest improvements you can make to your profile's first impression.",
};

export default function AskProfecia() {
  const [briefOpen, setBriefOpen] = useState(false);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string>(initialConversations[0].id);
  const [input, setInput] = useState<string>('');
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [selectedConnectorIds, setSelectedConnectorIds] = useState<string[]>(
    [],
  );
  const [connectorDropdownOpen, setConnectorDropdownOpen] = useState(false);
  const [questionDropdownOpen, setQuestionDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const connectorDropdownRef = useRef<HTMLDivElement>(null);
  const questionDropdownRef = useRef<HTMLDivElement>(null);

  const { connectedConnectors } = useConnectorStore();
  const { actions: feedActions, setActions } = useActionStore();

  // Ensure actions exist for any newly connected integrations
  useEffect(() => {
    if (connectedConnectors.length === 0) return;

    const existingConnectorNames = new Set(
      feedActions
        .map((action) => action.connectorName?.toLowerCase())
        .filter((name): name is string => Boolean(name)),
    );

    const missingConnectors = connectedConnectors.filter(
      (connector) => !existingConnectorNames.has(connector.name.toLowerCase()),
    );

    if (feedActions.length === 0) {
      setActions(generateAllInsights(connectedConnectors));
      return;
    }

    if (missingConnectors.length > 0) {
      const additions = missingConnectors.flatMap((connector, index) =>
        generateInsightsForConnector(connector, index),
      );
      const merged = [...feedActions, ...additions].sort(
        (a, b) => b.impactScore - a.impactScore,
      );
      setActions(merged);
    }
  }, [connectedConnectors, feedActions, setActions]);

  useEffect(() => {
    if (connectedConnectors.length > 0) {
      const storeConnectors: Connector[] = connectedConnectors.map((c) => ({
        id: c.id,
        name: c.name,
        active: true,
      }));
      setConnectors(storeConnectors);
    } else {
      setConnectors([]);
    }
  }, [connectedConnectors]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isLoading]);

  useEffect(() => {
    const randomQuestions = suggestedQuestionsBank
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setSuggestedQuestions(randomQuestions);
  }, [activeId]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        connectorDropdownRef.current &&
        !connectorDropdownRef.current.contains(e.target as Node)
      ) {
        setConnectorDropdownOpen(false);
      }
      if (
        questionDropdownRef.current &&
        !questionDropdownRef.current.contains(e.target as Node)
      ) {
        setQuestionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const insertFollowUpPrompt = (prompt: string, followUpId: string) => {
    setSelectedFollowUpId(followUpId);
    mockRespond(prompt);
  };

  const activeConv = conversations.find((c) => c.id === activeId)!;
  const toggleConnector = (id: string) => {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  };

  const addConversation = () => {
    if (conversations.length >= 3) return;
    const id = `c${Date.now()}`;
    const newConv: Conversation = {
      id,
      title: `Briefing ${conversations.length + 1}`,
      messages: [],
      attachments: [],
    };
    setConversations((prev) => [...prev, newConv]);
    setActiveId(id);
  };

  const mockRespond = (prompt: string) => {
    // Add user message first
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, { role: 'user', content: prompt }],
            }
          : c,
      ),
    );

    // Set loading state
    setIsLoading(true);

    // Use a predefined answer when available, otherwise fall back to the random bank
    setTimeout(
      () => {
        const response =
          predefinedAnswers[prompt] ??
          assistantResponsesBank[
            Math.floor(Math.random() * assistantResponsesBank.length)
          ];

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { role: 'assistant', content: response },
                  ],
                }
              : c,
          ),
        );
        setIsLoading(false);
      },
      1200 + Math.random() * 800,
    ); // 1.2s to 2s delay for realism
  };

  const sendPrompt = () => {
    if (!input.trim()) return;
    mockRespond(input.trim());
    setInput('');
  };

  const attachFile = (file?: File) => {
    if (!file) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, attachments: [...c.attachments, file.name] }
          : c,
      ),
    );
  };

  const exportConversation = () => {
    const text = activeConv.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConv.title.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-cyan-400 mb-1'>Profecia AI</h2>
          <p className=' text-slate-400'>
            Query your unified data with context-aware intelligence
          </p>
        </div>
        <button
          onClick={() => setBriefOpen(true)}
          className='flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-light-primary text-white hover:opacity-90 dark:bg-dark-primary'
        >
          <Plus className='w-4 h-4' /> New Briefing
        </button>
      </div>

      {/* Layout */}
      <div className='flex items-start justify-center gap-6 '>
        {/* Left column: merged dropdown sections */}
        <div className='flex flex-col gap-4 w-full max-w-sm'>
          {/* <AccordionSection title='Context Library'>
            <div className='space-y-2'>
              {['CI/CD Health Q4', 'API Scaling Issues'].map((t) => (
                <button
                  key={t}
                  className='w-full text-left cursor-pointer px-3 py-2 rounded-lg bg-light-border/60 dark:bg-dark-border/60 hover:bg-light-border dark:hover:bg-dark-border'
                >
                  {t}
                </button>
              ))}
            </div>
          </AccordionSection> */}

          <AccordionSection title='Available Connectors'>
            <div className='space-y-2 max-h-75 overflow-y-auto'>
              {connectors.length === 0 ? (
                <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                  No connected connectors yet. Visit the{' '}
                  <a
                    href='/dashboard/connectors'
                    className='text-blue-500 hover:underline font-bold'
                  >
                    Connectors
                  </a>{' '}
                  to connect your first integration.
                </p>
              ) : (
                connectors.map((c) => (
                  <label
                    key={c.id}
                    className='flex items-center justify-between px-3 py-2 rounded-lg bg-light-border/60 dark:bg-dark-border/60 hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors cursor-pointer'
                  >
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                        {getConnectorIcon(c.name, 14)}
                      </div>
                      <span>{c.name}</span>
                    </div>
                    <input
                      type='checkbox'
                      checked={c.active}
                      onChange={() => toggleConnector(c.id)}
                      className='accent-cyan-500'
                    />
                  </label>
                ))
              )}
            </div>
          </AccordionSection>

          <AccordionSection title='Suggested Follow-ups'>
            <div className='space-y-3 max-h-75 overflow-y-auto'>
              {connectors.length === 0 ? (
                <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                  No connected connectors yet. Connect integrations in the{' '}
                  <a
                    href='/dashboard/connectors'
                    className='text-blue-500 hover:underline font-bold'
                  >
                    Connectors
                  </a>{' '}
                  to see suggested follow-ups.
                </p>
              ) : (
                (selectedConnectorIds.length > 0
                  ? connectors.filter((c) =>
                      selectedConnectorIds.includes(c.id),
                    )
                  : connectors
                ).map((connector) => {
                  const connectorActions = feedActions.filter(
                    (a) =>
                      a.connectorName?.toLowerCase() ===
                      connector.name.toLowerCase(),
                  );
                  if (connectorActions.length === 0) return null;
                  return (
                    <div key={connector.id} className='space-y-2'>
                      <div className='flex items-center gap-2 mb-2 font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide'>
                        <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                          {getConnectorIcon(connector.name, 14)}
                        </div>
                        <span className='text-base'>{connector.name}</span>
                      </div>
                      <div className='space-y-1 ml-6'>
                        {connectorActions.map((action) => {
                          const followUpId = action.id;
                          return (
                            <button
                              // href={'/dashboard/action-feed'}
                              key={followUpId}
                              onClick={() =>
                                insertFollowUpPrompt(action.title, followUpId)
                              }
                              className={`w-full text-left flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm group ${
                                selectedFollowUpId === followUpId
                                  ? 'border border-cyan-500 bg-linear-to-r from-cyan-500 to-blue-500 text-white'
                                  : 'bg-light-border/60 dark:bg-dark-border/60 hover:bg-light-border/80 dark:hover:bg-dark-border/80'
                              }`}
                            >
                              <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0' />
                              <span className='flex-1'>{action.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AccordionSection>

          <Link
            href='/dashboard/action-feed'
            className='flex items-center cursor-pointer justify-between px-3 py-2 rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80'
          >
            <span>Action</span>
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        {/* Right column: Conversation Engine */}
        <div className='flex-1 flex flex-col gap-4  '>
          {/* Messages Container */}
          <div className='rounded-2xl border border-light-border bg-light-surface/60 dark:bg-dark-surface/60 p-4 max-h-233.75 flex flex-col'>
            <div className='flex items-center gap-2 mb-4 text-sm text-light-text-secondary dark:text-dark-text-secondary pb-4 border-b border-light-border dark:border-dark-border'>
              <Bot className='w-4 h-4' /> Profecia: Intelligent Assistant
            </div>

            <div className='flex-1 overflow-y-auto space-y-4 mb-4 min-h-87.5'>
              {activeConv.messages.length > 0 ? (
                <>
                  {/* Render messages */}
                  {activeConv.messages.map((m, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-xs lg:max-w-md ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            m.role === 'assistant'
                              ? 'bg-linear-to-r from-cyan-500 to-emerald-500'
                              : 'bg-light-border dark:bg-dark-border'
                          }`}
                        >
                          {m.role === 'assistant' ? (
                            <Bot className='w-4 h-4 text-white' />
                          ) : (
                            <span className='text-xs font-bold text-light-text dark:text-dark-text'>
                              You
                            </span>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`px-4 py-3 rounded-lg ${
                            m.role === 'assistant'
                              ? 'bg-light-border/60 dark:bg-dark-border/60 text-light-text dark:text-dark-text'
                              : 'bg-linear-to-r from-cyan-600 to-emerald-600 text-white'
                          }`}
                        >
                          <p className='text-sm leading-relaxed'>{m.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='flex justify-start'
                    >
                      <div className='flex items-end gap-2'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-linear-to-r from-cyan-500 to-emerald-500'>
                          <Bot className='w-4 h-4 text-white' />
                        </div>
                        <div className='px-4 py-3 rounded-lg bg-light-border/60 dark:bg-dark-border/60 flex items-center gap-2'>
                          <Loader className='w-4 h-4 animate-spin text-cyan-400' />
                          <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                            Analyzing...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className='rounded-2xl border border-light-border bg-light-surface/60 dark:bg-dark-surface/60 p-4 space-y-3'>
            {/* Connector filter + question suggestions row */}
            <div className='flex gap-2 flex-wrap'>
              {/* Dropdown 1: Connector multi-select */}
              <div className='relative' ref={connectorDropdownRef}>
                <button
                  onClick={() => {
                    setConnectorDropdownOpen((o) => !o);
                    setQuestionDropdownOpen(false);
                  }}
                  disabled={connectors.length === 0}
                  className='flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-light-border/60 dark:bg-dark-border/60 hover:bg-light-border dark:hover:bg-dark-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-light-border dark:border-dark-border cursor-pointer'
                >
                  <Filter className='w-3.5 h-3.5 text-cyan-400' />
                  <span>
                    {selectedConnectorIds.length === 0
                      ? 'Filter by Connector'
                      : `${selectedConnectorIds.length} connector${selectedConnectorIds.length !== 1 ? 's' : ''} selected`}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${connectorDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {connectorDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className='absolute left-0 top-full mt-1 z-20 min-w-50 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-xl'
                    >
                      <div className='p-2 space-y-1 max-h-48 overflow-y-auto'>
                        {connectors.map((c) => (
                          <label
                            key={c.id}
                            className='flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-light-border/60 dark:hover:bg-dark-border/60 cursor-pointer'
                          >
                            <input
                              type='checkbox'
                              checked={selectedConnectorIds.includes(c.id)}
                              onChange={() =>
                                setSelectedConnectorIds((prev) =>
                                  prev.includes(c.id)
                                    ? prev.filter((id) => id !== c.id)
                                    : [...prev, c.id],
                                )
                              }
                              className='accent-cyan-500'
                            />
                            <div className='w-5 h-5 bg-white rounded-full flex items-center justify-center shrink-0'>
                              {getConnectorIcon(c.name, 12)}
                            </div>
                            <span className='text-sm'>{c.name}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 2: Suggested Follow-up actions */}
              <div className='relative' ref={questionDropdownRef}>
                <button
                  onClick={() => {
                    setQuestionDropdownOpen((o) => !o);
                    setConnectorDropdownOpen(false);
                  }}
                  disabled={connectors.length === 0}
                  className='flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-light-border/60 dark:bg-dark-border/60 hover:bg-light-border dark:hover:bg-dark-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-light-border dark:border-dark-border cursor-pointer'
                >
                  <MessageSquare className='w-3.5 h-3.5 text-cyan-400' />
                  <span>Suggestion</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${questionDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {questionDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className='absolute left-0 top-full mt-1 z-20 min-w-[320px] max-w-sm rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-xl'
                    >
                      <div className='p-2 space-y-3 max-h-64 overflow-y-auto'>
                        {(() => {
                          // Require at least one connector to be selected in Filter by Connector
                          if (selectedConnectorIds.length === 0) {
                            return (
                              <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary px-2 py-2'>
                                Please select a connector from{' '}
                                <strong>Filter by Connector</strong> to see
                                suggestions.
                              </p>
                            );
                          }

                          // Build set of selected connector names (lowercase) for reliable matching
                          const selectedNames = new Set(
                            connectors
                              .filter((c) =>
                                selectedConnectorIds.includes(c.id),
                              )
                              .map((c) => c.name.toLowerCase()),
                          );

                          const filtered = feedActions.filter((a) =>
                            selectedNames.has(
                              (a.connectorName ?? '').toLowerCase(),
                            ),
                          );

                          const groups: Record<string, typeof feedActions> = {};
                          filtered.forEach((a) => {
                            const key = a.connectorName ?? 'Other';
                            if (!groups[key]) groups[key] = [];
                            groups[key].push(a);
                          });
                          if (Object.keys(groups).length === 0) {
                            return (
                              <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary px-2 py-1'>
                                No suggestions found for the selected
                                connector(s).
                              </p>
                            );
                          }
                          return Object.entries(groups).map(
                            ([connectorName, actions]) => (
                              <div key={connectorName}>
                                <div className='flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide'>
                                  <div className='w-4 h-4 bg-white rounded-full flex items-center justify-center shrink-0'>
                                    {getConnectorIcon(connectorName, 10)}
                                  </div>
                                  {connectorName}
                                </div>
                                <div className='mt-1 space-y-0.5'>
                                  {actions.map((action) => (
                                    <button
                                      key={action.id}
                                      onClick={() => {
                                        setQuestionDropdownOpen(false);
                                        mockRespond(action.title);
                                      }}
                                      className='w-full text-left px-2 py-1.5 text-sm rounded-lg hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors cursor-pointer'
                                    >
                                      {action.title}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ),
                          );
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className='flex items-end gap-2'>
              <textarea
                className='flex-1 h-24 rounded-lg bg-light-border/60 dark:bg-dark-border/60 p-3 text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-ring'
                placeholder='Ask a question...'
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setSelectedFollowUpId(null);
                }}
                disabled={isLoading}
              />
              <div className='flex flex-col gap-2'>
                <motion.button
                  onClick={sendPrompt}
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-3 py-2 rounded-lg bg-linear-to-r from-cyan-600 to-emerald-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
                >
                  <Send className='w-4 h-4' />
                </motion.button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='px-3 py-2 rounded-lg cursor-pointer bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors'
                >
                  <Paperclip className='w-4 h-4' />
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  className='hidden'
                  onChange={(e) => attachFile(e.target.files?.[0] || undefined)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Briefing Modal */}
      <GenericModal
        isOpen={briefOpen}
        onClose={() => setBriefOpen(false)}
        title={
          <div className='flex items-center gap-2'>
            <MessageSquare className='w-5 h-5' /> New Briefing
          </div>
        }
        subtitle='Create a new conversation tab with shared context.'
      >
        <div className='p-6 space-y-4'>
          <p className='text-sm text-white/80'>
            A new chat will use selected connectors and follow-ups. You can
            switch tabs anytime.
          </p>
          <div className='flex justify-end'>
            <button
              onClick={() => {
                addConversation();
                setBriefOpen(false);
              }}
              className='px-4 py-2 rounded-lg cursor-pointer bg-linear-to-r from-cyan-600 to-emerald-600 text-white'
            >
              Create Chat
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
}
