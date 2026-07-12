"use client";

import {
  AlertTriangle,
  Calendar,
  Heart,
  Lightbulb,
  RefreshCw,
  Shield,
  Smile,
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
import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartCard } from "@/features/dashboard/components/chart-card";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useSocialData } from "@/features/social/hooks/use-social-data";

const MOCK_VOLUNTEER_TRENDS = [
  { month: "Jan", hours: 50 },
  { month: "Feb", hours: 120 },
  { month: "Mar", hours: 190 },
  { month: "Apr", hours: 260 },
  { month: "May", hours: 340 },
  { month: "Jun", hours: 450 },
];

const MOCK_DEPT_COMP = [
  { name: "HR", participation: 96, color: "var(--color-success)" },
  { name: "Engineering", participation: 85, color: "var(--color-primary)" },
  { name: "Finance", participation: 74, color: "var(--color-info)" },
  { name: "Ops", participation: 68, color: "var(--color-warning)" },
];

const MOCK_SOCIAL_RECOMMENDATIONS = [
  {
    id: "srec-1",
    message:
      "Security awareness module completion rate dropped to 68% in Ops department.",
    severity: "warning",
  },
  {
    id: "srec-2",
    message:
      "Increase CSR volunteering options in regional hubs to boost participation rate.",
    severity: "info",
  },
  {
    id: "srec-3",
    message:
      "HR team has reached 96% social involvement. Share active policy structures.",
    severity: "success",
  },
];

export default function SocialPage() {
  const { overview, events, isLoading, isError, refetchAll } = useSocialData();
  const [mounted, setMounted] = useState(false);

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
          <h2 className="text-xl font-bold">Failed to load social module</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We encountered issues fetching your social initiatives and volunteer
            summaries. Please refresh.
          </p>
        </div>
        <button
          type="button"
          onClick={refetchAll}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <RefreshCw size={14} className="mr-2" />
          Retry Request
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Social Workspace"
        description="Monitor employee engagement, corporate social responsibility activities, volunteering contributions, and learning progress."
        actions={
          <button
            type="button"
            onClick={refetchAll}
            disabled={isLoading}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={12}
              className={isLoading ? "animate-spin mr-1.5" : "mr-1.5"}
            />
            Refresh
          </button>
        }
      />

      {isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border bg-card space-y-4"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Participation Rate"
              value={`${overview?.participation || 0}%`}
              icon={Users}
              iconColorClass="text-primary bg-primary/10"
              change="+3.4%"
              trend="up"
              subtext="Active members registration"
            />
            <StatCard
              title="Volunteer Hours"
              value={`${overview?.volunteer_hours || 0} hrs`}
              icon={Heart}
              iconColorClass="text-success bg-success/10"
              change="+22%"
              trend="up"
              subtext="Total volunteering logged"
            />
            <StatCard
              title="CSR Projects"
              value={overview?.csr_events || 0}
              icon={Shield}
              iconColorClass="text-info bg-info/10"
              trend="stable"
              subtext="Initiated community projects"
            />
            <StatCard
              title="Employee Satisfaction"
              value={`${(overview?.employee_satisfaction || 0) / 10}/10`}
              icon={Smile}
              iconColorClass="text-warning bg-warning/10"
              change="+0.2"
              trend="up"
              subtext="Annual feedback score index"
            />
          </div>

          {/* CHARTS CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Volunteer Hours Chart */}
            <ChartCard
              title="Volunteering Hours Tracking"
              subtitle="Accumulated volunteer contribution (Hours)"
            >
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MOCK_VOLUNTEER_TRENDS}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="glowSoc" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0.25}
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
                      opacity={0.6}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9 }}
                      stroke="var(--color-muted-foreground)"
                      opacity={0.6}
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
                      dataKey="hours"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#glowSoc)"
                      name="Hours"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
              )}
            </ChartCard>

            {/* Department Comparison BarChart */}
            <ChartCard
              title="Participation by Division"
              subtitle="Volunteering rates by department (%)"
            >
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MOCK_DEPT_COMP}
                    margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9 }}
                      stroke="var(--color-muted-foreground)"
                      opacity={0.6}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 9 }}
                      stroke="var(--color-muted-foreground)"
                      opacity={0.6}
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
                    <Bar dataKey="participation" radius={[6, 6, 0, 0]}>
                      {MOCK_DEPT_COMP.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
              )}
            </ChartCard>
          </div>

          {/* LOWER GRID: Leaderboard, Recommendations, Events list */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 text-left">
            <div className="space-y-6">
              {/* Leaderboard Card */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-3">
                  Engagement Leaderboard
                </h3>
                <ul
                  className="divide-y divide-border/40"
                  aria-label="Department ratings"
                >
                  {MOCK_DEPT_COMP.map((dept, index) => (
                    <li
                      key={dept.name}
                      className="py-3 flex items-center justify-between text-xs last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center font-bold text-[10px] text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-foreground">
                          {dept.name}
                        </span>
                      </div>
                      <span className="font-bold text-foreground">
                        {dept.participation}% Rate
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-3 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-warning" />
                  Social Action Items
                </h3>
                <div className="space-y-3">
                  {MOCK_SOCIAL_RECOMMENDATIONS.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-lg border text-xs leading-normal flex items-start gap-2.5 bg-card"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          rec.severity === "critical"
                            ? "bg-destructive animate-pulse"
                            : rec.severity === "warning"
                              ? "bg-warning"
                              : "bg-success"
                        }`}
                      />
                      <p className="text-muted-foreground">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CSR Activities & Events Feed */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Community Operations
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Events Feed
                </span>
              </div>
              <ul
                className="divide-y divide-border/40"
                aria-label="Social events listing"
              >
                {events?.map((event) => (
                  <li
                    key={event.id}
                    className="py-3 flex items-start gap-3 text-xs last:pb-0"
                  >
                    <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/10">
                      <Calendar size={12} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between min-w-0 gap-2">
                        <p className="font-medium text-foreground truncate">
                          {event.title}
                        </p>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold capitalize flex-shrink-0 ${
                            event.status === "completed"
                              ? "bg-success/15 text-success"
                              : event.status === "upcoming"
                                ? "bg-info/15 text-info"
                                : "bg-warning/15 text-warning"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{event.organizer}</span>
                        <span>•</span>
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.hours} hrs</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
