/**
 * Mock Reports Data
 */
import type { Report } from "@/types/report";

export const mockReports: Report[] = [
  {
    id: "rep-1",
    type: "environment",
    format: "pdf",
    status: "ready",
    createdAt: "2026-07-10T09:00:00Z",
    download_url: "#",
    generatedBy: "Owner",
  },
  {
    id: "rep-2",
    type: "social",
    format: "csv",
    status: "ready",
    createdAt: "2026-07-08T14:30:00Z",
    download_url: "#",
    generatedBy: "Admin",
  },
  {
    id: "rep-3",
    type: "organization",
    format: "excel",
    status: "ready",
    createdAt: "2026-07-01T08:00:00Z",
    download_url: "#",
    generatedBy: "Owner",
  },
  {
    id: "rep-4",
    type: "department",
    format: "pdf",
    status: "generating",
    createdAt: "2026-07-12T11:00:00Z",
    department: "Engineering",
  },
  {
    id: "rep-5",
    type: "governance",
    format: "pdf",
    status: "ready",
    createdAt: "2026-06-30T16:00:00Z",
    download_url: "#",
    generatedBy: "Admin",
  },
];
