"use client";

import {
  Activity,
  AlertTriangle,
  Droplet,
  Leaf,
  Lightbulb,
  RefreshCw,
  Shield,
  Trash2,
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
import { useEnvironmentData } from "@/features/environment/hooks/use-environment-data";
import { formatRelativeTime } from "@/lib/date";

const MOCK_CARBON_TRENDS = [
  { month: "Jan", saved: 20, limit: 10 },
  { month: "Feb", saved: 35, limit: 12 },
  { month: "Mar", saved: 60, limit: 18 },
  { month: "Apr", saved: 85, limit: 25 },
  { month: "May", saved: 110, limit: 30 },
  { month: "Jun", saved: 140, limit: 35 },
];

const MOCK_UTILITY_DISTR = [
  { name: "Energy", value: 340, color: "var(--color-primary)" },
  { name: "Water", value: 500, color: "var(--color-info)" },
  { name: "Waste", value: 75, color: "var(--color-warning)" },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: "rec-1",
    message:
      "Server room air-flow optimization could yield a 12% drop in energy cost.",
    severity: "critical",
  },
  {
    id: "rec-2",
    message:
      "Paper waste increased 5% in regional office hub. Launch printing limits.",
    severity: "warning",
  },
  {
    id: "rec-3",
    message:
      "Transition to greywater irrigation in HQ garden will save up to 40KL water.",
    severity: "success",
  },
];

export default function EnvironmentPage() {
  const { overview, activities, goals, isLoading, isError, refetchAll } =
    useEnvironmentData();

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
          <h2 className="text-xl font-bold">
            Failed to load environment module
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We had trouble retrieving your environmental metrics and goals.
            Please refresh to try again.
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
        title="Environmental Workspace"
        description="Monitor energy consumption, carbon reduction performance, water footprint and environmental compliance targets."
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
              title="Environmental Score"
              value={`${overview?.score || 0}/100`}
              icon={Shield}
              iconColorClass="text-primary bg-primary/10"
              change="+1.5%"
              trend="up"
              subtext="Compliance rating status"
            />
            <StatCard
              title="Carbon Footprint"
              value={`${overview?.carbon_saved || 0} t`}
              icon={Leaf}
              iconColorClass="text-success bg-success/10"
              change="+8%"
              trend="up"
              subtext="Saved emissions this year"
            />
            <StatCard
              title="Energy Consumption"
              value={`${overview?.energy || 0} MWh`}
              icon={Activity}
              iconColorClass="text-warning bg-warning/10"
              change="-5%"
              trend="down"
              subtext="Vs Q1 last year target"
            />
            <StatCard
              title="Water Footprint"
              value={`${overview?.water || 0} KL`}
              icon={Droplet}
              iconColorClass="text-info bg-info/10"
              change="-2%"
              trend="down"
              subtext="Greywater recycling target"
            />
          </div>

          {/* CHARTS CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Carbon Tracking Chart */}
            <ChartCard
              title="Carbon Footprint Tracking"
              subtitle="Saved emissions target performance (Tonnes)"
            >
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MOCK_CARBON_TRENDS}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="glowEnv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-success)"
                          stopOpacity={0.25}
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
                      dataKey="saved"
                      stroke="var(--color-success)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#glowEnv)"
                      name="Saved (t)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
              )}
            </ChartCard>

            {/* Utility Distribution comparison */}
            <ChartCard
              title="Resource Metrics Distribution"
              subtitle="Consumption levels comparison chart"
            >
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MOCK_UTILITY_DISTR}
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
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {MOCK_UTILITY_DISTR.map((entry) => (
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

          {/* LOWER SECTION: Goals, Activity Feed, Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Goals & Guidelines column */}
            <div className="space-y-6 text-left">
              {/* Sustainability Goals list */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-3">
                  Sustainability Goals
                </h3>
                <ul className="space-y-4">
                  {goals?.map((goal) => {
                    const percent = Math.min(
                      Math.round((goal.current / goal.target) * 100),
                      100,
                    );
                    return (
                      <li key={goal.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-foreground">{goal.title}</span>
                          <span className="text-muted-foreground">
                            {goal.current} / {goal.target} {goal.unit} (
                            {percent}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Deadline: {goal.deadline}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-3 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-warning" />
                  Environmental Recommendations
                </h3>
                <div className="space-y-3.5">
                  {MOCK_RECOMMENDATIONS.map((rec) => (
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

            {/* Activities logs column */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4 flex flex-col justify-between text-left">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Environmental Log
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Activities
                </span>
              </div>
              <ul
                className="divide-y divide-border/40"
                aria-label="Activity timeline"
              >
                {activities?.map((activity) => (
                  <li
                    key={activity.id}
                    className="py-3 flex items-start gap-3 text-xs last:pb-0"
                  >
                    <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/10">
                      {activity.type === "waste_reduction" ? (
                        <Trash2 size={12} />
                      ) : (
                        <Leaf size={12} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-medium text-foreground truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{activity.submittedBy}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(activity.date)}</span>
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
