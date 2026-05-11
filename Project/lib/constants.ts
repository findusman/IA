import {
  Home,
  MessageSquare,
  FileText,
  Settings,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
  { id: "chat", label: "AI Chat", icon: MessageSquare, href: "/chat" },
  { id: "documents", label: "Documents", icon: FileText, href: "/documents" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export const SUGGESTIONS = [
  {
    id: 1,
    icon: Lightbulb,
    text: "Try AI-powered analysis",
    color: "text-yellow-400",
  },
  {
    id: 2,
    icon: Sparkles,
    text: "Generate content ideas",
    color: "text-purple-400",
  },
  {
    id: 3,
    icon: TrendingUp,
    text: "Optimize your workflow",
    color: "text-blue-400",
  },
];

export const NOTIFICATIONS = [
  { id: 1, text: "New AI model available", time: "2m ago" },
  { id: 2, text: "Analysis completed", time: "1h ago" },
  { id: 3, text: "System update", time: "3h ago" },
];

export const LISTS = [
  { id: 1, name: "Recent Projects", count: 5 },
  { id: 2, name: "Favorites", count: 12 },
  { id: 3, name: "Shared with me", count: 8 },
];
