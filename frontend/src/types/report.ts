/**
 * Report Types
 *
 * Mirror report response shapes from 04-api-contract.md:
 * GET /reports, POST /reports/generate.
 */

export type ReportType =
  | "environment"
  | "social"
  | "governance"
  | "department"
  | "employee"
  | "organization";

export type ReportFormat = "pdf" | "csv" | "excel";

export interface Report {
  id: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  createdAt: string;
  download_url?: string;
  generatedBy?: string;
  department?: string;
}

export type ReportStatus = "generating" | "ready" | "failed" | "expired";

export interface GenerateReportPayload {
  type: ReportType;
  format: ReportFormat;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GenerateReportResponse {
  download_url: string;
}

export interface ReportFilter {
  type?: ReportType;
  format?: ReportFormat;
  dateFrom?: string;
  dateTo?: string;
}
