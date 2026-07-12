"use client";

import {
  AlertTriangle,
  BookmarkCheck,
  ClipboardList,
  FileCheck,
  FileText,
  Lightbulb,
  RefreshCw,
  Shield,
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
import { useGovernanceData } from "@/features/governance/hooks/use-governance-data";

const MOCK_COMPLIANCE_TRENDS = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 80 },
  { month: "Mar", score: 81 },
  { month: "Apr", score: 81 },
  { month: "May", score: 82 },
  { month: "Jun", score: 83 },
];

const MOCK_RISK_DISTR = [
  { name: "Environmental", risk: 20, color: "var(--color-success)" },
  { name: "Social", risk: 45, color: "var(--color-primary)" },
  { name: "Governance", risk: 30, color: "var(--color-warning)" },
];

const MOCK_GOV_RECOMMENDATIONS = [
  {
    id: "grec-1",
    message:
      "Supplier ESG Requirements draft requires immediate compliance committee sign-off.",
    severity: "critical",
  },
  {
    id: "grec-2",
    message:
      "Two audit findings in Data Security audit remain unresolved since last review cycle.",
    severity: "warning",
  },
  {
    id: "grec-3",
    message:
      "Data Privacy & Security Policy updated to version 2.4. Review sign-offs.",
    severity: "success",
  },
];

export default function GovernancePage() {
  const { overview, policies, audits, isLoading, isError, refetchAll } =
    useGovernanceData();
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
            Failed to load governance module
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We had trouble fetching your compliance, audit logs, and policy
            structures. Please refresh.
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
        title="Governance Workspace"
        description="Monitor organization compliance, risks indicators, signed policies, and pending internal regulatory approvals."
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
              title="Compliance Index"
              value={`${overview?.compliance_score || 0}%`}
              icon={Shield}
              iconColorClass="text-primary bg-primary/10"
              change="+0.8%"
              trend="up"
              subtext="Regulatory compliance rate"
            />
            <StatCard
              title="Registered Policies"
              value={overview?.total_policies || 0}
              icon={FileCheck}
              iconColorClass="text-success bg-success/10"
              trend="stable"
              subtext="Total active policies signed"
            />
            <StatCard
              title="Pending Audits"
              value={overview?.pending_audits || 0}
              icon={ClipboardList}
              iconColorClass="text-warning bg-warning/10"
              trend="stable"
              subtext="Scheduled reviews this cycle"
            />
            <StatCard
              title="Pending Approvals"
              value={overview?.pending_approvals || 0}
              icon={BookmarkCheck}
              iconColorClass="text-info bg-info/10"
              change="3 items"
              trend="stable"
              subtext="Reviews awaiting sign-off"
            />
          </div>

          {/* CHARTS CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Compliance Scores Trend Chart */}
            <ChartCard
              title="Compliance Score Progress"
              subtitle="Organizational compliance tracking (%)"
            >
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MOCK_COMPLIANCE_TRENDS}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="glowGov" x1="0" y1="0" x2="0" y2="1">
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
                      domain={[70, 90]}
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
                      dataKey="score"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#glowGov)"
                      name="Score (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-muted/40 animate-pulse rounded-md" />
              )}
            </ChartCard>

            {/* Risk Overview BarChart */}
            <ChartCard
              title="ESG Risk Index overview"
              subtitle="Associated risk scores by category (%)"
            >
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MOCK_RISK_DISTR}
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
                    <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                      {MOCK_RISK_DISTR.map((entry) => (
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

          {/* LOWER GRID: Policies, Recommendations, Audits feed */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 text-left">
            <div className="space-y-6">
              {/* Policies List Section */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-3">
                  Registered Policies
                </h3>
                <ul
                  className="divide-y divide-border/40"
                  aria-label="Organizational policies listing"
                >
                  {policies?.map((policy) => (
                    <li
                      key={policy.id}
                      className="py-3.5 flex items-center justify-between text-xs last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-primary/10">
                          <FileText size={12} />
                        </div>
                        <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
                          {policy.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {policy.category}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold capitalize ${
                            policy.status === "active"
                              ? "bg-success/15 text-success"
                              : policy.status === "under_review"
                                ? "bg-warning/15 text-warning"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {policy.status.replace("_", " ")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-3 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-warning" />
                  Compliance Recommendations
                </h3>
                <div className="space-y-3">
                  {MOCK_GOV_RECOMMENDATIONS.map((rec) => (
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

            {/* Audits Feed section */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Compliance Reviews
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Audits
                </span>
              </div>
              <ul
                className="divide-y divide-border/40"
                aria-label="Governance audit log"
              >
                {audits?.map((audit) => (
                  <li
                    key={audit.id}
                    className="py-3.5 flex items-start gap-3 text-xs last:pb-0"
                  >
                    <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/10">
                      <ClipboardList size={12} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between min-w-0 gap-2">
                        <p className="font-medium text-foreground truncate">
                          {audit.title}
                        </p>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold capitalize flex-shrink-0 ${
                            audit.status === "completed"
                              ? "bg-success/15 text-success"
                              : audit.status === "in_progress"
                                ? "bg-warning/15 text-warning"
                                : "bg-info/15 text-info"
                          }`}
                        >
                          {audit.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>Target: {audit.date}</span>
                        <span>•</span>
                        <span>{audit.findings} findings</span>
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
