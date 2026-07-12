/**
 * Mock Governance Data
 */
import type { Audit, GovernanceOverview, Policy } from "@/types/governance";

export const mockGovernanceOverview: GovernanceOverview = {
  compliance_score: 83,
  total_policies: 24,
  pending_audits: 2,
  pending_approvals: 3,
  risk_level: "low",
};

export const mockPolicies: Policy[] = [
  {
    id: "pol-1",
    title: "Environmental Impact Assessment Policy",
    category: "environmental",
    status: "active",
    createdAt: "2026-01-15",
    updatedAt: "2026-06-01",
    owner: "Owner",
  },
  {
    id: "pol-2",
    title: "Employee Code of Conduct",
    category: "hr",
    status: "active",
    createdAt: "2026-01-15",
    updatedAt: "2026-05-20",
    owner: "HR",
  },
  {
    id: "pol-3",
    title: "Data Privacy & Security Policy",
    category: "governance",
    status: "active",
    createdAt: "2026-02-01",
    updatedAt: "2026-07-01",
    owner: "Legal",
  },
  {
    id: "pol-4",
    title: "Supplier ESG Requirements",
    category: "compliance",
    status: "under_review",
    createdAt: "2026-06-01",
    updatedAt: "2026-07-10",
    owner: "Operations",
  },
];

export const mockAudits: Audit[] = [
  {
    id: "aud-1",
    title: "Q2 2026 ESG Compliance Audit",
    status: "scheduled",
    date: "2026-07-25",
    findings: 0,
  },
  {
    id: "aud-2",
    title: "Data Security Audit",
    status: "in_progress",
    date: "2026-07-12",
    findings: 2,
  },
  {
    id: "aud-3",
    title: "Q1 2026 Environmental Audit",
    status: "completed",
    date: "2026-04-15",
    findings: 1,
  },
];
