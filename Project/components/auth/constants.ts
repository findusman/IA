// components/auth/constants.ts
import { Code, FileText } from "lucide-react";

export const CATEGORIES = {
  it: {
    id: "it",
    name: "IT & Technology",
    subtitle: "Software, Cloud, DevOps, Data & AI",
    icon: Code,
    roles: [
      "Software Engineer",
      "Data Scientist",
      "DevOps Engineer",
      "System Administrator",
      "Product Manager",
      "QA Engineer",
    ],
    skills: [
      {
        name: "Machine Learning",
        insight: "Automate model training and deployment with CI/CD for ML.",
      },
      {
        name: "Cloud Architecture",
        insight: "Design fault-tolerant systems and optimize cloud costs.",
      },
      {
        name: "DevOps",
        insight:
          "Boost release velocity with automated pipelines and infrastructure as code.",
      },
      {
        name: "Data Engineering",
        insight:
          "Build reliable data pipelines and improve data quality for analytics.",
      },
      {
        name: "Web Development",
        insight:
          "Speed up front-end iteration with component-driven development.",
      },
    ],
  },
  finance: {
    id: "finance",
    name: "Accountancy & Finance",
    subtitle: "Tax, Audit, Compliance, Payroll & Reporting",
    icon: FileText,
    roles: [
      "Accountant",
      "Financial Analyst",
      "Tax Specialist",
      "Auditor",
      "Payroll Manager",
    ],
    skills: [
      {
        name: "Financial Reporting",
        insight: "Automate recurring reports and detect anomalies faster.",
      },
      {
        name: "Tax Compliance",
        insight: "Reduce manual errors and streamline filing processes.",
      },
      {
        name: "Audit",
        insight: "Use AI to prioritize high-risk transactions for review.",
      },
      {
        name: "Forecasting",
        insight: "Improve cash-flow forecasting with scenario-driven models.",
      },
    ],
  },
} as const;
