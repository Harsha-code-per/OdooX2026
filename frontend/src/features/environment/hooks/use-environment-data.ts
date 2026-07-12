"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getEnvironmentActivities,
  getEnvironmentOverview,
  getSustainabilityGoals,
} from "@/services/environment.service";

export function useEnvironmentData() {
  const overviewQuery = useQuery({
    queryKey: ["environment", "overview"],
    queryFn: getEnvironmentOverview,
  });

  const activitiesQuery = useQuery({
    queryKey: ["environment", "activities"],
    queryFn: getEnvironmentActivities,
  });

  const goalsQuery = useQuery({
    queryKey: ["environment", "goals"],
    queryFn: getSustainabilityGoals,
  });

  const isLoading =
    overviewQuery.isLoading ||
    activitiesQuery.isLoading ||
    goalsQuery.isLoading;

  const isError =
    overviewQuery.isError || activitiesQuery.isError || goalsQuery.isError;

  return {
    overview: overviewQuery.data,
    activities: activitiesQuery.data,
    goals: goalsQuery.data,
    isLoading,
    isError,
    refetchAll: () => {
      overviewQuery.refetch();
      activitiesQuery.refetch();
      goalsQuery.refetch();
    },
  };
}
