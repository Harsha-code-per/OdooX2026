/**
 * Compliance Module Types
 *
 * Types for compliance issues, comments, and attachments
 */

export interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  category: ComplianceIssueCategory;
  severity: ComplianceIssueSeverity;
  status: ComplianceIssueStatus;
  owner_id: string;
  department_id?: string;
  assigned_by?: string;
  due_date: string;
  raised_date: string;
  resolved_date?: string;
  closed_date?: string;
  resolution_notes?: string;
  resolution_method?: string;
  risk_level?: string;
  impact_description?: string;
  affected_stakeholders?: string[];
  source?: string;
  source_reference?: string;
  related_policy_id?: string;
  verified_by?: string;
  verified_at?: string;
  is_overdue: boolean;
  overdue_days: number;
  overdue_notification_sent: boolean;
  upcoming_due_date_sent: boolean;
  priority: number;
  escalation_level: number;
  escalated_to?: string;
  escalated_at?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    full_name: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
  };
}

export type ComplianceIssueCategory =
  | "environmental"
  | "social"
  | "governance"
  | "data_privacy"
  | "health_safety"
  | "financial"
  | "operational"
  | "legal"
  | "other";

export type ComplianceIssueSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "informational";

export type ComplianceIssueStatus =
  | "open"
  | "in_progress"
  | "under_review"
  | "resolved"
  | "closed"
  | "reopened";

export interface ComplianceIssueComment {
  id: string;
  compliance_issue_id: string;
  user_id: string;
  comment: string;
  comment_type: string; // 'update', 'question', 'concern', 'resolution'
  is_internal: boolean;
  previous_status?: string;
  new_status?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface ComplianceIssueAttachment {
  id: string;
  compliance_issue_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  file_extension: string;
  description?: string;
  attachment_type: string; // 'evidence', 'report', 'correspondence', 'other'
  created_at: string;
}

export interface ComplianceSummaryStats {
  total_issues: number;
  open_issues: number;
  in_progress_issues: number;
  resolved_issues: number;
  closed_issues: number;
  overdue_issues: number;
  critical_issues: number;
  high_priority_issues: number;
  average_resolution_time_hours?: number;
  issues_by_category: Record<string, number>;
  issues_by_severity: Record<string, number>;
}

export interface ComplianceOverdueCheck {
  overdue_count: number;
  upcoming_due_count: number;
  overdue_issues: ComplianceIssue[];
  upcoming_issues: ComplianceIssue[];
}

// Create/Update types
export interface ComplianceIssueCreate {
  owner_id: string;
  department_id?: string;
  assigned_by?: string;
  related_policy_id?: string;
  title: string;
  description: string;
  category: ComplianceIssueCategory;
  severity: ComplianceIssueSeverity;
  due_date: string;
  risk_level?: string;
  impact_description?: string;
  affected_stakeholders?: string[];
  source?: string;
  source_reference?: string;
  priority?: number;
}

export interface ComplianceIssueUpdate {
  title?: string;
  description?: string;
  category?: ComplianceIssueCategory;
  severity?: ComplianceIssueSeverity;
  status?: ComplianceIssueStatus;
  owner_id?: string;
  department_id?: string;
  due_date?: string;
  risk_level?: string;
  impact_description?: string;
  affected_stakeholders?: string[];
  priority?: number;
  resolution_notes?: string;
  resolution_method?: string;
}

export interface ComplianceIssueAssignment {
  issue_id: string;
  new_owner_id: string;
  assigned_by: string;
  notes?: string;
}

export interface ComplianceIssueEscalation {
  issue_id: string;
  escalate_to: string;
  escalation_level: number;
  escalated_by: string;
  notes?: string;
}

export interface ComplianceIssueCommentCreate {
  compliance_issue_id: string;
  user_id: string;
  comment: string;
  comment_type?: string;
  is_internal?: boolean;
}

export interface ComplianceIssueAttachmentCreate {
  compliance_issue_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  file_extension: string;
  description?: string;
  attachment_type?: string;
}
