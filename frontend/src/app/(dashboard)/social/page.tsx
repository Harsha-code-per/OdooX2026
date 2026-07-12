"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Coins,
  Flame,
  Gift,
  Heart,
  Lightbulb,
  Play,
  RefreshCw,
  Shield,
  Smile,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { challengeService } from "@/services/challenge-service";
import { rewardService } from "@/services/reward-service";
import type { Challenge, ChallengeProgress } from "@/types/challenge";
import type { Reward, UserPoints } from "@/types/reward";

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
  const [activeTab, setActiveTab] = useState<"csr" | "challenges" | "rewards">(
    "csr",
  );

  // Gamification & Rewards states
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participations, setParticipations] = useState<ChallengeProgress[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [gamificationLoading, setGamificationLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch challenges, participations, rewards, and user points
  const fetchGamificationData = useCallback(async () => {
    setGamificationLoading(true);
    try {
      const [chList, pList, rwList, pts] = await Promise.all([
        challengeService.getChallenges(),
        challengeService.getMyParticipations(),
        rewardService.getRewardCatalog(),
        rewardService.getUserPoints(),
      ]);
      setChallenges(chList);
      setParticipations(pList);
      setRewards(rwList);
      setUserPoints(pts);
    } catch (err) {
      console.error("Failed to load gamification data:", err);
    } finally {
      setGamificationLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "challenges" || activeTab === "rewards") {
      fetchGamificationData();
    }
  }, [activeTab, fetchGamificationData]);

  // Handle joining a challenge
  async function handleJoinChallenge(challengeId: string) {
    try {
      await challengeService.joinChallenge(challengeId);
      setActionSuccess("Successfully joined challenge! Let's get to work.");
      fetchGamificationData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to join challenge");
    }
  }

  // Handle completing a challenge (direct submission for MVP)
  async function handleCompleteChallenge(challengeId: string) {
    try {
      await challengeService.updateChallengeProgress(
        challengeId,
        100,
        "completed",
      );
      setActionSuccess(
        "Challenge completed! Points and XP credited successfully.",
      );
      fetchGamificationData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update challenge");
    }
  }

  // Handle redeeming a reward
  async function handleRedeemReward(rewardId: string) {
    try {
      await rewardService.redeemReward({ reward_id: rewardId });
      setActionSuccess(
        "Reward successfully redeemed! Check your email for details.",
      );
      fetchGamificationData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to redeem reward");
    }
  }

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
        title="Social & Gamification Workspace"
        description="Monitor corporate social responsibility activities, join eco challenges, track loyalty points, and redeem rewards catalog items."
        actions={
          <button
            type="button"
            onClick={activeTab === "csr" ? refetchAll : fetchGamificationData}
            disabled={isLoading || gamificationLoading}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={12}
              className={
                isLoading || gamificationLoading
                  ? "animate-spin mr-1.5"
                  : "mr-1.5"
              }
            />
            Refresh
          </button>
        }
      />

      {/* Success Banner */}
      {actionSuccess && (
        <div className="p-3 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2 animate-fade-in font-medium max-w-xl mx-auto text-left">
          <CheckCircle2 size={14} className="flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Tab Selectors */}
      <div className="flex border-b border-border pb-px gap-4 overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => setActiveTab("csr")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "csr"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>Volunteering & CSR</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("challenges")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "challenges"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy size={14} />
            <span>Sustainability Challenges</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("rewards")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "rewards"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Gift size={14} />
            <span>Rewards Shop</span>
          </div>
        </button>
      </div>

      {/* ==================== TAB 1: CSR ==================== */}
      {activeTab === "csr" &&
        (isLoading ? (
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
                        <linearGradient
                          id="glowSoc"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
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

            {/* LOWER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 text-left">
              <div className="space-y-6">
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

              {/* CSR Events list */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Community Operations
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Events Feed
                    </span>
                  </div>
                  <ul
                    className="divide-y divide-border/40 animate-fade-in"
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
          </div>
        ))}

      {/* ==================== TAB 2: CHALLENGES ==================== */}
      {activeTab === "challenges" &&
        (gamificationLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border bg-card space-y-4"
              >
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
              <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Flame size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Your Loyalty Balance
                  </span>
                  <p className="text-lg font-bold text-foreground">
                    {userPoints?.total_xp || 0} XP
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                  <Trophy size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Challenges Joined
                  </span>
                  <p className="text-lg font-bold text-foreground">
                    {participations.length} Active
                  </p>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((c) => {
                const part = participations.find((p) => p.challengeId === c.id);
                const isJoined = !!part;
                const isCompleted =
                  part?.progress === 100 || part?.status === "completed";

                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl border border-border bg-card shadow-2xs hover:border-primary/40 transition-colors flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
                          {c.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(c.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">
                        {c.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {c.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Rewards breakdown */}
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="text-primary flex items-center gap-1">
                          <Sparkles size={12} />+{Math.round(c.points * 1.5)} XP
                        </span>
                        <span className="text-warning flex items-center gap-1">
                          <Coins size={12} />+{c.points} Points
                        </span>
                      </div>

                      {/* Join / Progress Slider actions */}
                      {isCompleted ? (
                        <div className="p-2.5 rounded-lg bg-success/10 text-success text-xs font-semibold flex items-center gap-2 justify-center">
                          <CheckCircle size={14} />
                          <span>Challenge Completed</span>
                        </div>
                      ) : isJoined ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">
                              Progress
                            </span>
                            <span className="font-bold text-foreground">
                              {part.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${part.progress}%` }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCompleteChallenge(c.id)}
                            className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle size={12} />
                            Complete Challenge (100%)
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJoinChallenge(c.id)}
                          className="w-full h-9 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play size={12} />
                          Accept Challenge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* ==================== TAB 3: REWARDS ==================== */}
      {activeTab === "rewards" &&
        (gamificationLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border bg-card space-y-4"
              >
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                  <Coins size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Your Point Balance
                  </span>
                  <p className="text-xl font-bold text-foreground">
                    {userPoints?.available_points || 0} Coins
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Redeemable in the catalog shop
                  </p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <span>
                  Earn more coins by completing CSR Activities and
                  Sustainability Challenges!
                </span>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewards.map((r) => {
                const canAfford =
                  (userPoints?.available_points || 0) >= r.points_required;
                const isOutOfStock = r.stock_quantity <= 0;

                return (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl border border-border bg-card shadow-2xs hover:border-warning/30 transition-colors flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="h-28 w-full rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground text-2xl font-bold uppercase relative">
                        {r.name.slice(0, 2)}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl text-xs font-bold text-destructive uppercase tracking-wider">
                            Out of Stock
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground uppercase font-semibold">
                          {r.category}
                        </span>
                        <span className="font-semibold text-foreground">
                          {r.stock_quantity} left
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {r.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                        {r.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-xs font-bold text-warning">
                        <Coins size={14} />
                        <span>{r.points_required} Points</span>
                      </div>

                      {isOutOfStock ? (
                        <button
                          type="button"
                          disabled
                          className="w-full h-8 rounded-lg bg-muted text-muted-foreground text-[10px] font-bold cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => handleRedeemReward(r.id)}
                          className={`w-full h-8 rounded-lg text-[10px] font-bold shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                            canAfford
                              ? "bg-warning text-black hover:bg-warning/90"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          <Gift size={12} />
                          Redeem Reward
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </PageContainer>
  );
}
