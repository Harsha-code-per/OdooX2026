/**
 * Compliance Service
 *
 * Service functions for compliance issues management
 */

import { apiClient } from "@/lib/api-client";
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

const COMPLIANCE_BASE = "/api/v1/compliance";

export const complianceService = {
  // Compliance Issues
  async getComplianceIssues(params?: {
    category?: string;
    severity?: string;
    status?: string;
    owner_id?: string;
    department_id?: string;
    is_overdue?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<ComplianceIssue[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.severity) queryParams.append("severity", params.severity);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.owner_id) queryParams.append("owner_id", params.owner_id);
    if (params?.department_id) queryParams.append("department_id", params.department_id);
    if (params?.is_overdue !== undefined) queryParams.append("is_overdue", params.is_overdue.toString());
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${COMPLIANCE_BASE}/issues${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<ComplianceIssue[]>(endpoint);
  },

  async getComplianceSummary(): Promise<ComplianceSummaryStats> {
    return apiClient.get<ComplianceSummaryStats>(`${COMPLIANCE_BASE}/issues/summary`);
  },

  async checkOverdueIssues(): Promise<ComplianceOverdueCheck> {
    return apiClient.get<ComplianceOverdueCheck>(`${COMPLIANCE_BASE}/issues/overdue-check`);
  },

  async getComplianceIssue(issueId: string): Promise<ComplianceIssue> {
    return apiClient.get<ComplianceIssue>(`${COMPLIANCE_BASE}/issues/${issueId}`);
  },

  async createComplianceIssue(issue: ComplianceIssueCreate): Promise<ComplianceIssue> {
    return apiClient.post<ComplianceIssue>(`${COMPLIANCE_BASE}/issues`, issue);
  },

  async updateComplianceIssue(
    issueId: string,
    update: ComplianceIssueUpdate
  ): Promise<ComplianceIssue> {
    return apiClient.put<ComplianceIssue>(`${COMPLIANCE_BASE}/issues/${issueId}`, update);
  },

  async assignComplianceIssue(assignment: ComplianceIssueAssignment): Promise<ComplianceIssue> {
    return apiClient.post<ComplianceIssue>(
      `${COMPLIANCE_BASE}/issues/${assignment.issue_id}/assign`,
      assignment
    );
  },

  async escalateComplianceIssue(escalation: ComplianceIssueEscalation): Promise<ComplianceIssue> {
    return apiClient.post<ComplianceIssue>(
      `${COMPLIANCE_BASE}/issues/${escalation.issue_id}/escalate`,
      escalation
    );
  },

  // Comments
  async getIssueComments(issueId: string): Promise<ComplianceIssueComment[]> {
    return apiClient.get<ComplianceIssueComment[]>(`${COMPLIANCE_BASE}/issues/${issueId}/comments`);
  },

  async createIssueComment(comment: ComplianceIssueCommentCreate): Promise<ComplianceIssueComment> {
    return apiClient.post<ComplianceIssueComment>(
      `${COMPLIANCE_BASE}/issues/${comment.compliance_issue_id}/comments`,
      comment
    );
  },

  // Attachments
  async getIssueAttachments(issueId: string): Promise<ComplianceIssueAttachment[]> {
    return apiClient.get<ComplianceIssueAttachment[]>(`${COMPLIANCE_BASE}/issues/${issueId}/attachments`);
  },

  async createIssueAttachment(attachment: ComplianceIssueAttachmentCreate): Promise<ComplianceIssueAttachment> {
    return apiClient.post<ComplianceIssueAttachment>(
      `${COMPLIANCE_BASE}/issues/${attachment.compliance_issue_id}/attachments`,
      attachment
    );
  },
};