"use client";

import {
  AlertTriangle,
  Building2,
  CheckSquare,
  FilePlus,
  Leaf,
  PlusCircle,
  RefreshCw,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityCard } from "@/features/dashboard/components/activity-card";
import { ChartCard } from "@/features/dashboard/components/chart-card";
import { InsightCard } from "@/features/dashboard/components/insight-card";
import { LeaderboardCard } from "@/features/dashboard/components/leaderboard-card";
import { QuickActionCard } from "@/features/dashboard/components/quick-action-card";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { useAuth } from "@/hooks/use-auth";

const QUICK_ACTIONS = [
  {
    title: "Invite Member",
    description: "Add new users to roles",
    href: "/team/members",
    icon: UserPlus,
    colorClass: "text-info bg-info/10 hover:border-info/30",
  },
  {
    title: "Create Department",
    description: "Set up department units",
    href: "/team/departments",
    icon: Building2,
    colorClass: "text-primary bg-primary/10 hover:border-primary/30",
  },
  {
    title: "Log ESG Activity",
    description: "Submit environmental actions",
    href: "/environment",
    icon: PlusCircle,
    colorClass: "text-success bg-success/10 hover:border-success/30",
  },
  {
    title: "Create Policy",
    description: "Publish compliance standards",
    href: "/governance/policies",
    icon: FilePlus,
    colorClass: "text-warning bg-warning/10 hover:border-warning/30",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    summary,
    charts,
    activities,
    insights,
    leaderboard,
    isLoading,
    isError,
    refetchAll,
  } = useDashboardData();

  const [mounted, setMounted] = useState(false);

  // Mount logic for SSR safety with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (isError) {
    return (
      <PageContainer className="py-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-xl font-bold">Failed to load dashboard data</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An error occurred while fetching the ESG command center records.
            Please check your network connection and try again.
          </p>
        </div>
        <button
          type="button"
          onClick={refetchAll}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <RefreshCw size={14} className="mr-2 animate-spin-hover" />
          Retry Request
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8">
      {/* Page Header */}
      <SectionHeader
        title={`Command Center`}
        description={`Welcome back, ${user?.name || "User"}. Review organization-wide sustainability metrics.`}
        actions={
          <button
            type="button"
            onClick={refetchAll}
            disabled={isLoading}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
            title="Refresh dashboard stats"
          >
            <RefreshCw
              size={12}
              className={isLoading ? "animate-spin mr-1.5" : "mr-1.5"}
            />
            Refresh
          </button>
        }
      />

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-8">
          {/* Skeletons: Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border bg-card space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Skeletons: Main content area grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
            <div className="space-y-6">
              <Skeleton className="h-60 rounded-2xl" />
              <Skeleton className="h-60 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[280px] rounded-2xl" />
              <Skeleton className="h-[280px] rounded-2xl" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Actions Shortcuts Launchpad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                href={action.href}
                icon={action.icon}
                colorClass={action.colorClass}
              />
            ))}
          </div>

          {/* Core KPI metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Overall ESG Score"
              value={summary?.overall_esg || "0"}
              icon={Shield}
              iconColorClass="text-primary bg-primary/10"
              change="+3.2%"
              trend="up"
              subtext="Updated 15m ago"
            />
            <StatCard
              title="Carbon Saved"
              value={`${summary?.carbon_saved || "0"} t`}
              icon={Leaf}
              iconColorClass="text-success bg-success/10"
              change="+12%"
              trend="up"
              subtext="Vs Q1 target emissions"
            />
            <StatCard
              title="Participation Rate"
              value={`${summary?.employees || "0"} Active`}
              icon={Users}
              iconColorClass="text-info bg-info/10"
              change="+5.4%"
              trend="up"
              subtext={`${summary?.employees} members registered`}
            />
            <StatCard
              title="Governance Audits"
              value={`${summary?.pending_approvals || "0"} Pending`}
              icon={CheckSquare}
              iconColorClass="text-warning bg-warning/10"
              trend="stable"
              subtext="Compliance reviews queue"
            />
          </div>

          {/* Main Visualizations and Logs feed */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
            {/* Left Side: Charts & Insights */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ESG Performance Trend */}
                <ChartCard
                  title="ESG Performance Trend"
                  subtitle="Unified sustainability scores tracking"
                >
                  {mounted && charts?.monthly_esg ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={charts.monthly_esg}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="scoreGlow"
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
                          domain={[60, 95]}
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
                          dataKey="value"
                          stroke="var(--color-primary)"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#scoreGlow)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
                  )}
                </ChartCard>

                {/* Carbon Saved Over Time */}
                <ChartCard
                  title="Carbon Reduction Trend"
                  subtitle="Saved carbon savings index (tonnes)"
                >
                  {mounted && charts?.carbon_trend ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={charts.carbon_trend}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="carbonGlow"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-success)"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-success)"
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
                          domain={[0, 150]}
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
                          dataKey="value"
                          stroke="var(--color-success)"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#carbonGlow)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
                  )}
                </ChartCard>
              </div>

              {/* Insights List Section */}
              <div className="space-y-4 text-left">
                <h3 className="text-sm font-semibold text-foreground">
                  AI Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights?.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Leaderboard & Activity */}
            <div className="space-y-6">
              {/* Leaderboard Card */}
              {leaderboard && <LeaderboardCard entries={leaderboard} />}

              {/* Recent Activity Card list */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Audit Log Feed
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Real-time
                  </span>
                </div>
                <div className="divide-y divide-border/30">
                  {activities?.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
