"use client";

import {
  Bell,
  FileText,
  LayoutDashboard,
  Leaf,
  Search,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Mock chart data
const esgTrendData = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 75 },
  { month: "Mar", score: 74 },
  { month: "Apr", score: 78 },
  { month: "May", score: 80 },
  { month: "Jun", score: 81 },
  { month: "Jul", score: 84 },
];

const departmentData = [
  { name: "Eng", score: 88, color: "var(--color-primary)" },
  { name: "HR", score: 91, color: "var(--color-success)" },
  { name: "Fin", score: 82, color: "var(--color-chart-2)" },
  { name: "Ops", score: 86, color: "var(--color-chart-5)" },
  { name: "Mkt", score: 79, color: "var(--color-warning)" },
];

export function HeroDashboardPreview() {
  const [mounted, setMounted] = useState(false);

  // Mount logic for SSR safety with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden text-card-foreground select-none relative group/dashboard">
      {/* Decorative top lighting bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] h-[580px] md:h-[620px]">
        {/* Mock Sidebar */}
        <div className="hidden md:flex flex-col bg-muted/30 border-r border-border p-4 justify-between">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Leaf size={12} className="text-primary-foreground" />
              </div>
              <span className="text-xs font-semibold text-foreground tracking-tight">
                EcoSphere
              </span>
            </div>

            {/* Nav list */}
            <nav className="space-y-1.5" aria-label="Mock Sidebar Navigation">
              <span className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground">
                <LayoutDashboard size={14} />
                Dashboard
              </span>
              <span className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                <Leaf size={14} />
                Environmental
              </span>
              <span className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                <Users size={14} />
                Social
              </span>
              <span className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                <Shield size={14} />
                Governance
              </span>
              <span className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                <FileText size={14} />
                Reports
              </span>
            </nav>
          </div>

          {/* Bottom Settings */}
          <div className="space-y-2">
            <span className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
              <Settings size={14} />
              Settings
            </span>
          </div>
        </div>

        {/* Dashboard Content area */}
        <div className="flex flex-col overflow-hidden bg-background">
          {/* Header */}
          <div className="flex h-14 items-center justify-between px-6 border-b border-border bg-card/50">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span>Home</span>
              <span className="text-border">/</span>
              <span className="text-foreground">Dashboard</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search bar mock */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <div className="h-8.5 w-48 rounded-md border border-border bg-muted/40 pl-8 pr-2.5 text-[11px] flex items-center justify-between text-muted-foreground gap-2">
                  <span>Search...</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground/60 leading-none">
                    <span>⌘</span>K
                  </kbd>
                </div>
              </div>

              {/* Notification bell mock */}
              <div className="relative p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                <Bell size={15} />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-destructive rounded-full" />
              </div>

              {/* Avatar fallback */}
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold border border-primary/20">
                HR
              </div>
            </div>
          </div>

          {/* Inner Content scroll area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Welcome message */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                Welcome, Harshavardhan
              </h2>
              <p className="text-xs text-muted-foreground">
                Here is the ESG footprint summary for your organization today.
              </p>
            </div>

            {/* 4 KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KPI 1 */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Overall ESG
                  </span>
                  <Shield size={14} className="text-primary" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">84 / 100</span>
                  <span className="text-[10px] font-medium text-success flex items-center gap-0.5">
                    <TrendingUp size={10} />
                    +3.2%
                  </span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Carbon Saved
                  </span>
                  <Leaf size={14} className="text-success" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">120 t</span>
                  <span className="text-[10px] font-medium text-success flex items-center gap-0.5">
                    <TrendingUp size={10} />
                    +12%
                  </span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Participation
                  </span>
                  <Users size={14} className="text-info" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">81%</span>
                  <span className="text-[10px] font-medium text-success flex items-center gap-0.5">
                    <TrendingUp size={10} />
                    +5.4%
                  </span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Approvals
                  </span>
                  <UserCheck size={14} className="text-warning" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">3 Pending</span>
                  <span className="text-[10px] text-muted-foreground">
                    Requires review
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Line chart widget */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">
                    ESG Performance Trend
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Jan - Jul 2026
                  </span>
                </div>
                <div className="h-36">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={esgTrendData}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorScore"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-primary)"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-primary)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 9 }}
                          stroke="var(--color-muted-foreground)"
                          opacity={0.5}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          domain={[60, 90]}
                          tick={{ fontSize: 9 }}
                          stroke="var(--color-muted-foreground)"
                          opacity={0.5}
                          tickLine={false}
                          axisLine={false}
                        />
                        <ChartTooltip
                          contentStyle={{
                            fontSize: 10,
                            background: "var(--color-card)",
                            borderColor: "var(--color-border)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="var(--color-primary)"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorScore)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
                  )}
                </div>
              </div>

              {/* Bar chart widget */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">
                    Department ESG Ratings
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Top Performing
                  </span>
                </div>
                <div className="h-36">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 9 }}
                          stroke="var(--color-muted-foreground)"
                          opacity={0.5}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 9 }}
                          stroke="var(--color-muted-foreground)"
                          opacity={0.5}
                          tickLine={false}
                          axisLine={false}
                        />
                        <ChartTooltip
                          contentStyle={{
                            fontSize: 10,
                            background: "var(--color-card)",
                            borderColor: "var(--color-border)",
                          }}
                        />
                        <Bar
                          dataKey="score"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={24}
                        >
                          {departmentData.map((entry) => (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={entry.color}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Activity feed */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
              <span className="text-xs font-semibold block">
                Recent ESG Actions
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">
                      Solar panel installation approved
                    </span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    15m ago
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-foreground">
                      Zero Waste Week challenge completed
                    </span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    2h ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
