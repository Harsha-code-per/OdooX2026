/**
 * Governance Module Types
 *
 * Mirror governance response shapes from 04-api-contract.md:
 * GET /governance/overview, GET /governance/policies.
 */

export interface GovernanceOverview {
  compliance_score: number;
  total_policies: number;
  pending_audits: number;
  pending_approvals: number;
  risk_level: RiskLevel;
}

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  status: PolicyStatus;
  createdAt: string;
  updatedAt: string;
  owner?: string;
  description?: string;
}

export type PolicyCategory =
  | "environmental"
  | "social"
  | "governance"
  | "compliance"
  | "security"
  | "hr"
  | "other";

export type PolicyStatus = "draft" | "active" | "under_review" | "archived";

export interface Audit {
  id: string;
  title: string;
  status: AuditStatus;
  date: string;
  auditor?: string;
  findings?: number;
}

export type AuditStatus = "scheduled" | "in_progress" | "completed" | "overdue";

export interface CreatePolicyPayload {
  title: string;
  category: PolicyCategory;
  description?: string;
}
