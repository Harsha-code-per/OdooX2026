"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAudits,
  getGovernanceOverview,
  getPolicies,
} from "@/services/governance.service";

export function useGovernanceData() {
  const overviewQuery = useQuery({
    queryKey: ["governance", "overview"],
    queryFn: getGovernanceOverview,
  });

  const policiesQuery = useQuery({
    queryKey: ["governance", "policies"],
    queryFn: getPolicies,
  });

  const auditsQuery = useQuery({
    queryKey: ["governance", "audits"],
    queryFn: getAudits,
  });

  const isLoading =
    overviewQuery.isLoading || policiesQuery.isLoading || auditsQuery.isLoading;

  const isError =
    overviewQuery.isError || policiesQuery.isError || auditsQuery.isError;

  return {
    overview: overviewQuery.data,
    policies: policiesQuery.data,
    audits: auditsQuery.data,
    isLoading,
    isError,
    refetchAll: () => {
      overviewQuery.refetch();
      policiesQuery.refetch();
      auditsQuery.refetch();
    },
  };
}
