"use client";

import { useQuery } from "@tanstack/react-query";
import { getSocialEvents, getSocialOverview } from "@/services/social.service";

export function useSocialData() {
  const overviewQuery = useQuery({
    queryKey: ["social", "overview"],
    queryFn: getSocialOverview,
  });

  const eventsQuery = useQuery({
    queryKey: ["social", "events"],
    queryFn: getSocialEvents,
  });

  const isLoading = overviewQuery.isLoading || eventsQuery.isLoading;
  const isError = overviewQuery.isError || eventsQuery.isError;

  return {
    overview: overviewQuery.data,
    events: eventsQuery.data,
    isLoading,
    isError,
    refetchAll: () => {
      overviewQuery.refetch();
      eventsQuery.refetch();
    },
  };
}
