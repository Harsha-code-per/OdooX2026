/**
 * Use Compliance Hook
 *
 * React hooks for compliance issues management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complianceService } from "@/services/compliance-service";
import type {
  ComplianceIssue,
  ComplianceIssueComment,
  ComplianceIssueAttachment,
  ComplianceSummaryStats,
  ComplianceOverdueCheck,
  ComplianceIssueCreate,
  ComplianceIssueUpdate,
  ComplianceIssueAssignment,
  ComplianceIssueEscalation,
  ComplianceIssueCommentCreate,
  ComplianceIssueAttachmentCreate,
} from "@/types/compliance";

// Compliance Issue Hooks
export function useComplianceIssues(params?: {
  category?: string;
  severity?: string;
  status?: string;
  owner_id?: string;
  department_id?: string;
  is_overdue?: boolean;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["compliance", "issues", params],
    queryFn: () => complianceService.getComplianceIssues(params),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useComplianceSummary() {
  return useQuery({
    queryKey: ["compliance", "summary"],
    queryFn: () => complianceService.getComplianceSummary(),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

export function useOverdueComplianceIssues() {
  return useQuery({
    queryKey: ["compliance", "overdue"],
    queryFn: () => complianceService.checkOverdueIssues(),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useComplianceIssue(issueId: string) {
  return useQuery({
    queryKey: ["compliance", "issues", issueId],
    queryFn: () => complianceService.getComplianceIssue(issueId),
    enabled: !!issueId,
  });
}

export function useCreateComplianceIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issue: ComplianceIssueCreate) =>
      complianceService.createComplianceIssue(issue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance"] });
    },
  });
}

export function useUpdateComplianceIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, update }: { issueId: string; update: ComplianceIssueUpdate }) =>
      complianceService.updateComplianceIssue(issueId, update),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["compliance"] });
      queryClient.invalidateQueries({ queryKey: ["compliance", "issues", variables.issueId] });
    },
  });
}

export function useAssignComplianceIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignment: ComplianceIssueAssignment) =>
      complianceService.assignComplianceIssue(assignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance"] });
    },
  });
}

export function useEscalateComplianceIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (escalation: ComplianceIssueEscalation) =>
      complianceService.escalateComplianceIssue(escalation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance"] });
    },
  });
}

// Comments Hooks
export function useIssueComments(issueId: string) {
  return useQuery({
    queryKey: ["compliance", "comments", issueId],
    queryFn: () => complianceService.getIssueComments(issueId),
    enabled: !!issueId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}

export function useCreateIssueComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: ComplianceIssueCommentCreate) =>
      complianceService.createIssueComment(comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["compliance", "comments", variables.compliance_issue_id] });
      queryClient.invalidateQueries({ queryKey: ["compliance"] });
    },
  });
}

// Attachments Hooks
export function useIssueAttachments(issueId: string) {
  return useQuery({
    queryKey: ["compliance", "attachments", issueId],
    queryFn: () => complianceService.getIssueAttachments(issueId),
    enabled: !!issueId,
  });
}

export function useCreateIssueAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachment: ComplianceIssueAttachmentCreate) =>
      complianceService.createIssueAttachment(attachment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["compliance", "attachments", variables.compliance_issue_id] });
    },
  });
}

// Custom hooks for specific use cases
export function useMyComplianceIssues() {
  const { data: user } = useAuth(); // Assuming you have an auth hook
  return useComplianceIssues(
    user ? { owner_id: user.id } : undefined
  );
}

export function useDepartmentComplianceIssues() {
  const { data: user } = useAuth(); // Assuming you have an auth hook
  return useComplianceIssues(
    user?.department_id ? { department_id: user.department_id } : undefined
  );
}

export function useOverdueIssuesCount() {
  const { data: overdueCheck } = useOverdueComplianceIssues();
  return overdueCheck?.overdue_count || 0;
}

export function useCriticalIssues() {
  const { data: summary } = useComplianceSummary();
  return summary?.critical_issues || 0;
}

// Hook for compliance dashboard
export function useComplianceDashboard() {
  const { data: summary, isLoading: summaryLoading } = useComplianceSummary();
  const { data: overdue, isLoading: overdueLoading } = useOverdueComplianceIssues();
  const { data: myIssues, isLoading: myIssuesLoading } = useMyComplianceIssues();

  return {
    totalIssues: summary?.total_issues || 0,
    openIssues: summary?.open_issues || 0,
    overdueIssues: overdue?.overdue_count || 0,
    upcomingDue: overdue?.upcoming_due_count || 0,
    criticalIssues: summary?.critical_issues || 0,
    myIssues: myIssues || [],
    isLoading: summaryLoading || overdueLoading || myIssuesLoading,
  };
}