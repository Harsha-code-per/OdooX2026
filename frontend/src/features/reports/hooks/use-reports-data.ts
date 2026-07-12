"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateReport, getReports } from "@/services/report.service";
import type { GenerateReportPayload } from "@/types/report";

export function useReportsData() {
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  const generateReportMutation = useMutation({
    mutationFn: (payload: GenerateReportPayload) => generateReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  return {
    reports: reportsQuery.data || [],
    isLoading: reportsQuery.isLoading,
    isError: reportsQuery.isError,
    generateReport: generateReportMutation.mutateAsync,
    isGenerating: generateReportMutation.isPending,
    refetch: reportsQuery.refetch,
  };
}
