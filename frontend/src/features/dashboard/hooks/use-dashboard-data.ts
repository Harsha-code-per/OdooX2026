"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardActivity,
  getDashboardCharts,
  getDashboardInsights,
  getDashboardSummary,
  getLeaderboard,
} from "@/services/dashboard.service";

export function useDashboardData() {
  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });

  const chartsQuery = useQuery({
    queryKey: ["dashboard", "charts"],
    queryFn: getDashboardCharts,
  });

  const activityQuery = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: getDashboardActivity,
  });

  const insightsQuery = useQuery({
    queryKey: ["dashboard", "insights"],
    queryFn: getDashboardInsights,
  });

  const leaderboardQuery = useQuery({
    queryKey: ["dashboard", "leaderboard"],
    queryFn: getLeaderboard,
  });

  const isLoading =
    summaryQuery.isLoading ||
    chartsQuery.isLoading ||
    activityQuery.isLoading ||
    insightsQuery.isLoading ||
    leaderboardQuery.isLoading;

  const isError =
    summaryQuery.isError ||
    chartsQuery.isError ||
    activityQuery.isError ||
    insightsQuery.isError ||
    leaderboardQuery.isError;

  return {
    summary: summaryQuery.data,
    charts: chartsQuery.data,
    activities: activityQuery.data,
    insights: insightsQuery.data,
    leaderboard: leaderboardQuery.data,
    isLoading,
    isError,
    refetchAll: () => {
      summaryQuery.refetch();
      chartsQuery.refetch();
      activityQuery.refetch();
      insightsQuery.refetch();
      leaderboardQuery.refetch();
    },
  };
}
