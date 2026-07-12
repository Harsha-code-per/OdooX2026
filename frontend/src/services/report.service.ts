/**
 * Report Service
 */
import { delay } from "@/lib/helpers";
import { mockReports } from "@/mocks/reports";
import type {
  GenerateReportPayload,
  GenerateReportResponse,
  Report,
} from "@/types/report";

const SIMULATED_DELAY = 600;

export async function getReports(): Promise<Report[]> {
  await delay(SIMULATED_DELAY);
  return mockReports;
}

export async function generateReport(
  payload: GenerateReportPayload,
): Promise<GenerateReportResponse> {
  await delay(
    1200,
  ); /* Longer delay — report generation is a heavier operation */
  return { download_url: `#mock-report-${payload.type}-${payload.format}` };
}
